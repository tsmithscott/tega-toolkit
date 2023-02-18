from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from oauthlib.oauth2 import WebApplicationClient

import pymysql

from config import Config
from flask_mail import Mail


GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET
GOOGLE_DISCOVERY_URL = ("https://accounts.google.com/.well-known/openid-configuration")

app = Flask(__name__, template_folder="templates", static_folder="static") # Create the Flask app
app.config.from_object(Config) # Load the config

pymysql.install_as_MySQLdb()
db = SQLAlchemy(app) # Create the SQLAlchemy object
login_manager = LoginManager(app) # Create the login manager
login_manager.login_view = "login" # Set the login view for @login_required

client = WebApplicationClient(GOOGLE_CLIENT_ID) # Create the OAuth client

mail = Mail(app) # Create the mail object

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


# Import the views and models and create the database
from models import Users
from views import *
with app.app_context():
    db.create_all()
