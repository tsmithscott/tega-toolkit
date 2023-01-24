from flask_login import UserMixin

from app import db


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    profile_pic = db.Column(db.String(100))

    def __init__(self, name, email, profile_pic):
        self.name = name
        self.email = email
        self.profile_pic = profile_pic
