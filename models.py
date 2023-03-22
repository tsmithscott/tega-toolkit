from flask_login import UserMixin

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
    last_updated = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=False)
    users = db.relationship('Users', backref='games')
    forms = db.relationship('Forms', backref='games')


    def __init__(self, id, game, name, complete, last_updated, user_id):
        self.id = id
        self.game = game
        self.name = name
        self.complete = complete
        self.user_id = user_id
        self.last_updated = last_updated


class Forms(db.Model):
    __tablename__ = 'forms'
    
    id = db.Column(db.String(100), primary_key=True)
    game_id = db.Column(db.String(100), db.ForeignKey('games.id'), nullable=False)
    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=True)
    datetime_submitted = db.Column(db.String(20), nullable=False)

    def __init__(self, id, game_id, datetime_submitted):
        self.id = id
        self.game_id = game_id
        self.datetime_submitted = datetime_submitted
