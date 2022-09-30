from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255)) 
    stats = db.Column(db.String(60), default= """{"W":0, "D":0, "L":0}""")
    open_games = db.Column(db.Integer, default=0, nullable=False)

    def __repr__(self):
        return f"""USER {self.id}, 
                   username: {self.username} 
                   email: {self.email} 
                   stats: {self.stats} 
                   open games: {self.open_games}"""

class Admin(db.Model):
    id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, primary_key=True)

class Games(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    player0id =  db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    player1id =  db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20))
    result = db.Column(db.String(20))
    time_started = db.Column(db.DateTime)
    last_change = db.Column(db.DateTime)
    unverified_move = db.Column(db.String(20))
    draw_proposed = db.Column(db.String(20))
    gameasjson = db.Column(db.String(600))

    def __repr__(self):
        return f"""GAME {self.id}, 
                   player1id: {self.player1id}, 
                   player0id: {self.player0id} 
                   status: {self.status} 
                   result: {self.result},
                   time_started: {self.time_started}
                   last_change: {self.last_change}
                   draw_proposed: {self.draw_proposed}"""