import json
import uuid
import threading
import zipfile
import io
from datetime import datetime

import requests
from flask import (redirect, render_template, request, session,
                   url_for, make_response, jsonify, send_from_directory, send_file)
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from jwt.exceptions import InvalidSignatureError

from app import Config, app, client, db, get_google_provider_cfg, login_manager
from models import Users, Games, Forms
from security.jwt import JWT
from utilities.fileutils import Fileutils
from utilities.latestsection import LatestSection
from pdf.template import Template


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


@app.route("/", methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    else:
        return render_template("index.html", title="Tega Toolkit")
    

@app.route("/dashboard", methods=['GET', 'POST'])
def dashboard():
    games = None
    
    if current_user.is_authenticated:
        games = Games.query.filter_by(user_id=current_user.id).order_by(Games.last_updated.desc()).all()
        forms = []
        if games:
            for game in games:
                for form in game.forms:
                    forms.append(form.to_dict())
            games = [game.to_dict() for game in games]
        else:
            games = []
    else:
        forms = []
        games = []

    return render_template("dashboard.html", title="Tega Toolkit - Dashboard", base_url=Config.BASE_URL, games=games, forms=forms)


@app.route("/form/<game_id>", methods=['GET'])
def assessment_form(game_id):
    game = Games.query.filter_by(id=game_id).first()
    game_exists = False
    if game:
        game_exists = True
    
    return render_template("form.html", title="Tega Toolkit - Assessment Form", game=game, game_exists=game_exists)


@app.route("/form-submit", methods=['POST'])
def assessment_form_submit():
    form_data = request.get_json()['form_data']
    game_id = form_data['gameID']
    form_data.pop('gameID')
    
    if form_data and game_id:
        form_id = uuid.uuid4().hex
        
        while Forms.query.filter_by(id=form_id).first():
            game_id = uuid.uuid4().hex
        
        form = Forms(
                id = form_id,
                data = json.dumps(form_data),
                game_id = game_id,
                datetime_submitted=datetime.now().strftime('%d-%m-%Y, %H:%M:%S')
            )
        
        db.session.add(form)
        db.session.commit()
        
        return "", 200

    
@app.route("/google-login", methods=["GET"])
def google_login():
    google_provider_cfg = get_google_provider_cfg()
    authorisation_endpoint = google_provider_cfg["authorization_endpoint"]
    
    request_uri = client.prepare_request_uri(
        authorisation_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"]
    )
    
    return redirect(request_uri)
        
                
@app.route("/google-login/callback")
def callback():
    code = request.args.get("code")
    
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(Config.GOOGLE_CLIENT_ID, Config.GOOGLE_CLIENT_SECRET),
    )
    
    client.parse_request_body_response(json.dumps(token_response.json()))
    
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)
    
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400



    # If user doesn't exist, create a new user
    if not Users.query.filter_by(email=users_email).first():
        user = Users(
            id=unique_id,
            name=users_name, 
            email=users_email, 
            profile_pic=picture)
        db.session.add(user)
        db.session.commit()
    # If user exists, select the user
    else:
        user = Users.query.filter_by(email=users_email).first()
    
    # Begin user session by logging the user in
    login_user(user)

    # Send user back to homepage
    response = make_response(redirect(url_for('dashboard')))
    return response


@app.route("/get_sections", methods=["GET"])
def ajax_get_sections():
    with open('static/json_data/sections.json', 'r') as sections_file:
        data = json.loads(sections_file.read())
        
    return make_response(
        jsonify(data),
        200
    )


@app.route("/get_characteristics", methods=["GET"])
def ajax_get_characteristics():
    with open('static/json_data/characteristics.json', 'r') as characteristics_file:
        data = json.loads(characteristics_file.read())
        
    return make_response(
        jsonify(data),
        200
    )
    
    
@app.route("/get_model", methods=["GET"])
def ajax_get_model():
    with open('static/json_data/model.json', 'r', encoding="utf-8") as characteristics_file:
        data = json.loads(characteristics_file.read())
        
    return make_response(
        jsonify(data),
        200
    )

@app.route("/get_game/<game_id>", methods=["GET"])
def get_game(game_id):
    game = Games.query.filter_by(id=game_id).first()
    
    if game:
        if game.user_id == current_user.id:
            return make_response(
                jsonify(game.serialise()),
                200
            )
        else:
            return "This game does not belong to this user.", 500
    else:
        return make_response(
            jsonify({}),
            404
        )

    
@app.route("/delete_game/<game_id>", methods=["POST"])
def delete_games(game_id):
    game = Games.query.filter_by(id=game_id).first()
    forms = Forms.query.filter_by(game_id=game_id)
    
    if forms:
        for form in forms:
            db.session.delete(form)
    if game:
        db.session.delete(game)
        db.session.commit()
        
        return '', 200
    else:
        return 'Error occurred, please contact support', 404
    
    
@app.route('/download-game-json/<game_id>', methods=["GET", "POST"])
def download_ajax_json(game_id):
    if current_user.is_authenticated and request.method == 'GET':
        game = Games.query.filter_by(id=game_id).first()
        
        if game:
            if game.user_id == current_user.id:
                game_dict = JWT.decode_jwt(game.game)
                
                with open(f'./tmp/{game_id}.json', 'w', encoding="utf-8") as file:
                    file.write(json.dumps(game_dict))
                    
                garbage_thread = threading.Thread(target=Fileutils.garbage_collection, args=(f'./tmp/{game_id}.json', 15), daemon=True)
                garbage_thread.start()
                    
                return send_file(f'./tmp/{game_id}.json', as_attachment=True)
            else:
                return "This game does not belong to this user.", 500
        else:
            return "", 404
    else:
        if request.method == 'POST':
            game = JWT.decode_jwt(request.get_json()["game_data"])
            
            return json.dumps(game), 200
        else:
            return "", 405
        

@app.route('/download-game-forms/<game_id>', methods=["GET"])
def download_ajax_forms(game_id):
    if current_user.is_authenticated:
        game = Games.query.filter_by(id=game_id).first()
        
        if game:
            if game.user_id == current_user.id:
                forms = Forms.query.filter_by(game_id=game_id)
                form_files = []
                
                if forms:
                    for form in forms:
                        data = json.loads(form.data)
                        form_files.append(Template.generate_form(data['feedback'],
                                                                data['post_test'],
                                                                data['post_playing'],
                                                                form.id,
                                                                form.game_id,
                                                                game.name))
                        
                    with zipfile.ZipFile(f'./tmp/{game.id}-forms.zip', 'w') as forms_zip:
                        for filepath in form_files:
                            forms_zip.write(filepath)
                        
                    for filepath in form_files:
                        garbage_thread = threading.Thread(target=Fileutils.garbage_collection, args=(filepath, 15), daemon=True)
                        garbage_thread.start()
                        
                    garbage_thread = threading.Thread(target=Fileutils.garbage_collection, args=(f'./tmp/{game.id}-forms.zip', 60), daemon=True)
                    garbage_thread.start()
                    
                    with open(f'./tmp/{game.id}-forms.zip', 'rb') as zip_binary_file:
                        zip_data = zip_binary_file.read()
                        
                    return send_file(
                        io.BytesIO(zip_data),
                        as_attachment=True,
                        download_name=f'{game.id}-forms.zip'
                    )
                else:
                    return "", 404
            else:
                return "This game does not belong to this user.", 401
        else:
            return "", 404
    else:
        return "", 400
    
    
@app.route('/upload-game', methods=["POST"])
def upload_game():
    if current_user.is_authenticated:
        if 'file' not in request.files:
            return "No file submitted", 400
        else:
            file = request.files['file']
            name = request.form['game_name']
            
            if file.filename == '':
                return "No file submitted", 400
            else:
                if file.filename.split('.', 1)[1] == 'json':
                    game_id = uuid.uuid4().hex
                    
                    if Games.query.filter_by(id=game_id).first():
                        while game_id in Games.query.filter_by(id=game_id).first():
                            game_id = uuid.uuid4().hex
                            
                    game = json.loads(file.read())
                    latest_section = LatestSection.find(game.keys())
                    if latest_section == "playability":
                        latest_section = "justification"
                    
                    print(game.keys())
                    print(latest_section)
                    
                    game_jwt = JWT.generate_jwt(game)
                    complete = True if latest_section == "justification" else False
                    update_datetime = datetime.now().strftime('%d-%m-%Y, %H:%M:%S')
                    
                    new_game = Games(
                        id=game_id,
                        game=game_jwt,
                        name=name,
                        user_id=current_user.id,
                        complete=complete,
                        latest_section=latest_section,
                        last_updated=update_datetime
                    )
                    db.session.add(new_game)
                    db.session.commit()
                    
                    return "", 200
                    
                else:
                    return "Incorrent file type", 400


@app.route('/ajax-autosave', methods=["POST"])
def ajax_autosave():
    saved_game_uuid = request.get_json()['gameuuid']
    complete = request.get_json()['complete']
    latest_section = request.get_json()['latestsection']
    name = None if not "name" in (request.get_json()).keys() else request.get_json()['name']
    update_datetime = datetime.now().strftime('%d-%m-%Y, %H:%M:%S')
    token = JWT.generate_jwt(request.get_json()['current_game'])
    
    if saved_game_uuid:
        game_uuid = saved_game_uuid
    else:
        game_uuid = uuid.uuid4().hex
    
    if current_user.is_authenticated:
        if Games.query.filter_by(id=game_uuid).first():
            current_game = Games.query.filter_by(id=game_uuid).first()
            current_game.game = token
            current_game.last_updated = update_datetime
            current_game.complete = complete
            
            db.session.commit()
        else:
            while Games.query.filter_by(id=game_uuid).first():
                game_uuid = uuid.uuid4().hex
                
            new_game = Games(
                id=game_uuid,
                game=token,
                name=name,
                user_id=current_user.id,
                complete=complete,
                latest_section=latest_section,
                last_updated=update_datetime
            )
            
            db.session.add(new_game)
            db.session.commit()
    
    return {"_game_data": token, "_game_id": game_uuid}, 200


@app.route('/ajax-update-name', methods=["POST"])
def ajax_update_name():
    saved_game_uuid = request.get_json()['gameuuid']
    name = request.get_json()['name'] if request.get_json()['name'] else None
    update_datetime = datetime.now().strftime('%d-%m-%Y, %H:%M:%S')
    
    if current_user.is_authenticated:
        if Games.query.filter_by(id=saved_game_uuid).first():
            current_game = Games.query.filter_by(id=saved_game_uuid).first()
            current_game.last_updated = update_datetime
            current_game.name = name
            
            db.session.commit()
            
            return "", 200
        else:
            return "", 404
    else:
        return "", 200


@app.route('/ajax-update-section', methods=["POST"])
def ajax_update_section():
    gameid = request.form['gameid']
    section = request.form['section']
    token = JWT.generate_jwt({'section': section})
    
    if current_user.is_authenticated:
        if Games.query.filter_by(id=gameid).first():
            game = Games.query.filter_by(id=gameid).first()
            game.latest_section = section
            db.session.commit()
    
    response = make_response()
    response.set_cookie("_latest_section", token, secure=True)
    response.status_code = 200
    return response


@app.route('/ajax-parse', methods=["POST"])
def ajax_parse():
    try:
        game_data = JWT.decode_jwt(request.form['jwt'])
        response = make_response(
            jsonify(
                game_data
            ), 200
        )
        response.headers['Content-Type'] == 'application/json'
        return response
    except InvalidSignatureError:
        print(request.get_json()['jwt'])
        response = make_response()
        response.status_code = 400


@app.route("/logout")
@login_required
def logout():
    try:
        logout_user()
        return "", 200
    except:
        return "", 500
