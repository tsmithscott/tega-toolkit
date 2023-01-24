from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from oauthlib.oauth2 import WebApplicationClient

from config import Config

GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET
GOOGLE_DISCOVERY_URL = ("https://accounts.google.com/.well-known/openid-configuration")

app = Flask(__name__, template_folder="templates", static_folder="static") # Create the Flask app
app.config.from_object(Config) # Load the config

db = SQLAlchemy(app) # Create the SQLAlchemy object
login_manager = LoginManager(app) # Create the login manager
login_manager.login_view = "login" # Set the login view to the login function

client = WebApplicationClient(GOOGLE_CLIENT_ID)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


# Import the views and models and create the database
from models import Users
from views import *
with app.app_context():
    db.create_all()
