from flask_login import UserMixin

from app import db


class Users(db.Model, UserMixin):
    
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=True)
    profile_pic = db.Column(db.String(256), nullable=True)
    account_confirmed = db.Column(db.Boolean, nullable=True)


    def __init__(self, id, name, email, profile_pic, password, account_confirmed):
        self.id = id
        self.name = name
        self.email = email
        self.profile_pic = profile_pic
        self.password = password
        self.account_confirmed = account_confirmed

