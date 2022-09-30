import sqlite3
import os
import json
import datetime

from sqlalchemy_utils import database_exists
from werkzeug.security import generate_password_hash, check_password_hash, safe_str_cmp
from dotenv import load_dotenv

from .models import db, User, Games, Admin
from .newgame import game as gameasjson

load_dotenv()
MAX_OPEN_GAMES = int(os.environ.get("MAX_OPEN_GAMES"))

def create_user(username: str, password: str, email: str):
    password_hash = generate_password_hash(password)
    user = User(username=username, 
                email=email, 
                password=password_hash, open_games = 0)    
    try:
        db.session.add(user)
        db.session.commit()
        return "User was registered successfully"
    except Exception as e:
        if e.args[0].endswith('email'):
            return "Email already in use"
        elif e.args[0].endswith('username'):
            return "Username already in use"
        else:
            return e.args[0]    

def get_all_games_from_user(userid: str):
    white_games =  Games.query.filter_by(player0id=userid).all()
    black_games =  Games.query.filter_by(player1id=userid).all()
    return white_games + black_games

def get_user_stats(userid: str):
    user =  User.query.filter_by(id=userid).first()
    if user:
        return { "stats": json.loads(user.stats), "open_games" : user.open_games}
    else:
        return { "msg": "No such user"}

def get_user_by_username(username: str):
    return User.query.filter_by(username=username).first()
    
def get_user_by_id(id: str):
    return User.query.filter_by(id=id).first()

def get_game_by_id(gameid: str):
    return Games.query.filter_by(id=gameid).first()

def create_new_game(userid: str):
    game = Games(player0id=userid,
                gameasjson= gameasjson,
                status="Open")
    user = User.query.filter_by(id=userid).first()         
    user.open_games += 1   
    db.session.add(game)
    db.session.commit()
    return game                

def join_game(userid: str):
    user = get_user_by_id(userid)
    if not user:
        return {"msg", "User not found"}  
    if user.open_games >= MAX_OPEN_GAMES:
        return { "msg": "All Slots filled" }
    game =  Games.query.filter(Games.player0id != str(user.id), Games.player1id == None).first()
    if game:
        start_game(game, user)
        return { "response": "Joined New Game. Ready to play" }
    if not game:
        create_new_game(user.id)        
        return { "response": "New game created. Invite open." }

def end_game(game: Games):
    gameasjson = json.loads(game.gameasjson)
    gameasjson["status"] = "Ended"
    game.draw_proposed = None
    game.status = "Ended"
    game.last_change = datetime.datetime.now()
    game.gameasjson = json.dumps(gameasjson)
    db.session.commit()

def start_game(game: Games, user: User):
    game.time_started = datetime.datetime.now()
    game.last_change = datetime.datetime.now()
    game.status = "Playing"
    game.player1id = user.id  
    user.open_games += 1 
    db.session.commit()

def change_element_in_db(gameid: str, dict_of_changes: dict):
    game = get_game_by_id(gameid)
    if game:
        for item, new_value in dict_of_changes.items():
            setattr(game, item, new_value)
    db.session.commit()        

def add_stat_to_user(userid: str, single_stat: str):
    user = get_user_by_id(userid)
    if user:
        original_stats = json.loads(user.stats)
        original_stats[single_stat] += 1
        user.stats = json.dumps(original_stats)
        user.open_games -= 1
        db.session.commit()

def get_other_player(game: Games, userid: str):
    if userid == game.player0id: return game.player1id
    if userid == game.player1id: return game.player0id

def add_statistics(game: Games, draw: bool, winner: str, loser: bool):
    if draw:
        if game.player0id and game.player1id:
            add_stat_to_user(game.player0id, "D")
            add_stat_to_user(game.player1id, "D")
    if winner:
        add_stat_to_user(winner, "W")
        add_stat_to_user(get_other_player(game, winner), "L")
    if loser:
        add_stat_to_user(loser, "L")
        add_stat_to_user(get_other_player(game, loser), "W")    

def end_game_and_add_statistics(gameid: str, draw: bool, winner: str, loser: str):
    game = get_game_by_id(gameid)
    if game:
        end_game(game)
        add_statistics(game, draw, winner, loser)

def create_db(app, database_url: str):
    db.init_app(app) 
    if not database_exists(database_url):
        with app.app_context():
            db.create_all()

def promote_user_to_admin(userid):
    db.session.add(Admin(adminid=userid))
    db.session.commit()

def delete_user_by_id(userid):
    User.query.filter_by(userid=userid).delete()

def demote_user_to_commoner(userid):    
    Admin.query.filter_by(adminid=userid).delete()