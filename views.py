import json

import requests
from flask import (Blueprint, redirect, render_template, request, session,
                   url_for)
from flask_login import current_user, login_required, login_user, logout_user

from app import Config, app, client, db, get_google_provider_cfg, login_manager
from models import Users


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


@app.route("/", methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        # return (
        #     "<p>Hello, {}!</p><p>Email: {}</p>"
        #     '<img src="{}" alt="Google profile pic"></img>'
        #     '<a class="button" href="/logout">Logout</a>'.format(
        #         current_user.name,
        #         current_user.email,
        #         current_user.profile_pic
        #     )
        # )
        return redirect(url_for("dashboard"))
    else:
        return render_template("index.html", title="Tega Toolkit")
    
    
@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        # return (
        #     "<p>Hello, {}!</p><p>Email: {}</p>"
        #     '<img src="{}" alt="Google profile pic"></img>'
        #     '<a class="button" href="/logout">Logout</a>'.format(
        #         current_user.name,
        #         current_user.email,
        #         current_user.profile_pic
        #     )
        # )
        return redirect(url_for("dashboard"))
    else:
        return render_template("login.html", title="Tega Toolkit - Login")


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
    if not Users.query.filter_by(email=users_email).first():
        user = Users(name=users_name, 
                     email=users_email, 
                     profile_pic=picture)
        db.session.add(user)
        db.session.commit()
    else:
        user = Users.query.filter_by(email=users_email).first()
    
    # Begin user session by logging the user in
    login_user(user)

    # Send user back to homepage
    return redirect(url_for("dashboard"))


@app.route("/ajax_handler", methods=["POST"])
def ajax_handler():
    print(request.form['data'])
    return "Successful", 200


@app.route("/signup")
def signup():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    else:
        return render_template("signup.html")


@app.route("/reset-password")
def reset_password():
    return render_template("reset.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))