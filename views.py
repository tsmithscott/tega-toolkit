import json
import uuid

import requests
from flask import (redirect, render_template, request, session,
                   url_for, make_response, jsonify, send_from_directory)
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from jwt.exceptions import InvalidSignatureError

from app import Config, app, client, db, get_google_provider_cfg, login_manager
from models import Users
from security.jwt import JWT
from confirmation.sendmail import SendMail


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


@app.route("/", methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    else:
        return render_template("index.html", title="Tega Toolkit")
    
    
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if current_user.is_authenticated:
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", title="Tega Toolkit - Login")
    elif request.method == 'POST':
        email = request.form['email']
        
        if Users.query.filter_by(email=email).first():
            user = Users.query.filter_by(email=email).first()
            if check_password_hash(user.password, request.form['password']):
                if user.account_confirmed:
                    login_user(user)
                    return url_for('dashboard')
                else:
                    response = make_response()
                    response.status_code = 406
                    return response
            else:
                return '', 400
        else:
            return '', 400
    else:
        return '', 405


@app.route("/dashboard", methods=['GET', 'POST'])
def dashboard():
    '''---ADD LOGIC TO THIS---'''
    if request.method == "POST":
        data = request.form.get("profile_button")
        if data == "test":
            session["input_type"] = data
    '''-----------------------'''

    return render_template("dashboard.html", title="Tega Toolkit - Dashboard")
        
    
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
        # unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # Doesn't exist? Add it to the database.
    user_id = uuid.uuid4().hex

    while Users.query.filter_by(id=user_id).first():
        user_id = uuid.uuid4().hex

    if not Users.query.filter_by(email=users_email).first():
        user = Users(
            id=user_id,
            name=users_name, 
            email=users_email, 
            profile_pic=picture,
            password=None,
            account_confirmed=None)
        db.session.add(user)
        db.session.commit()
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
    with open('static/json_data/model.json', 'r') as characteristics_file:
        data = json.loads(characteristics_file.read())
        
    return make_response(
        jsonify(data),
        200
    )


@app.route("/ajax_handler", methods=["POST"])
def ajax_handler():
    print(request.form['data'])
    return "Successful", 200


@app.route('/ajax-autosave', methods=["POST"])
def ajax_autosave():
    token = JWT.generate_jwt(request.get_json()["current_game"])
    response = make_response()
    response.set_cookie("_game_data", token, secure=True)
    response.status_code = 200
    return response


@app.route('/ajax-update-section', methods=["POST"])
def ajax_update_section():
    token = JWT.generate_jwt(request.form.to_dict())
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
        response = make_response()
        response.status_code = 400


@app.route("/register-user", methods=["POST"])
def register_user():
    if not Users.query.filter_by(email=request.form['email']).first():
        user_id = uuid.uuid4().hex

        while Users.query.filter_by(id=user_id).first():
            user_id = uuid.uuid4().hex

        new_user = Users(
            id=user_id,
            name=None,
            email=request.form['email'],
            profile_pic=url_for('fallback_profile'),
            password=generate_password_hash(request.form['password'], method='sha256'),
            account_confirmed=False
        )

        db.session.add(new_user)
        db.session.commit()
        mail = SendMail()
        mail.send_confirmation(request.form['email'], JWT.generate_jwt({"email":request.form['email']}))

        response = make_response(jsonify(message='/login'))
        response.status_code = 200
        return response
    else:
        user = Users.query.filter_by(email=request.form['email']).first()
        
        if user.account_confirmed:
            response = make_response(jsonify(message='E-500-1'))
            response.status_code = 400
            return response
        else:
            response = make_response(jsonify(message='E-500-2'))
            response.status_code = 400
            return response


@app.route("/confirm-account/<token>")
def confirm_account(token):
    try:
        data = JWT.decode_jwt(token)
        user = Users.query.filter_by(email=data['email']).first()
        user.account_confirmed = True
        db.session.commit()
        login_user(user)
        
        return redirect('/dashboard')
    except InvalidSignatureError:
        return 'This token is invalid. Contact support', 400


@app.route("/reset-password")
def reset_password():
    return render_template("reset.html")


@app.route("/resend-confirmation", methods=["POST"])
def send_confirmation():
    email = request.form["email"]
    mail = SendMail()
    mail.send_confirmation(email, JWT.generate_jwt({"email":email}))
    return '', 200


@app.route("/logout")
@login_required
def logout():
    logout_user()
    
    response = make_response(redirect(url_for('index')))
    response.set_cookie('_user_id', '', expires=0)
    
    return response


@app.route("/fallback-profile")
@login_required
def fallback_profile():
    return send_from_directory('static/images', 'default-profile-pic.png')