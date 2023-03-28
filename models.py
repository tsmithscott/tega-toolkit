from flask_login import UserMixin

from security.jwt import JWT
from app import db


class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.String(100), primary_key=True)
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


class Games(db.Model):
    __tablename__ = 'games'
    
    id = db.Column(db.String(100), primary_key=True)
    game = db.Column(db.Text(), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    complete = db.Column(db.Boolean, nullable=False)
    latest_section = db.Column(db.String(40), nullable=False)
    last_updated = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=False)
    forms = db.relationship('Forms', backref=db.backref('forms', uselist=False))


    def __init__(self, id, game, name, complete, latest_section, last_updated, user_id):
        self.id = id
        self.game = game
        self.name = name
        self.complete = complete
        self.latest_section = latest_section
        self.last_updated = last_updated
        self.user_id = user_id
        
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "complete": self.complete,
            "latest_section": self.latest_section,
            "last_updated": self.last_updated,
            "user_id": self.user_id
        }
        
    
    def serialise(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "complete": self.complete,
            "latest_section": JWT.generate_jwt({"section": self.latest_section}),
            "game": self.game
        }


class Forms(db.Model):
    __tablename__ = 'forms'
    
    id = db.Column(db.String(100), primary_key=True)
    data = db.Column(db.Text(), nullable=False)
    game_id = db.Column(db.String(100), db.ForeignKey('games.id'), nullable=False)
    datetime_submitted = db.Column(db.String(20), nullable=False)

    def __init__(self, id, data, game_id, datetime_submitted):
        self.id = id
        self.data = data
        self.game_id = game_id
        self.datetime_submitted = datetime_submitted
