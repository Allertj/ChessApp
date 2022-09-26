import sqlite3
import os
import json

from sqlalchemy_utils import database_exists
from werkzeug.security import generate_password_hash, check_password_hash, safe_str_cmp
from dotenv import load_dotenv

from .models import db, User, Games
from .newgame import game as gameasjson
from .utc_time import utc_time

load_dotenv()
MAX_OPEN_GAMES = int(os.getenv("MAX_OPEN_GAMES"))

def create_user(username, password, email):
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

def get_all_games_from_user(userid):
    white_games =  Games.query.filter_by(player0id=userid).all()
    black_games =  Games.query.filter_by(player1id=userid).all()
    return white_games + black_games

def get_user_stats(userid):
    user =  User.query.filter_by(id=userid).first()
    if user:
        return { "stats": user.stats, "open_games" : user.open_games}
    else:
        return { "message": "No such user"}

def get_user_by_username(username):
    return User.query.filter_by(username=username).first()
    
def get_user_by_id(id):
    return User.query.filter_by(id=id).first()

def get_game_by_id(gameid):
    return Games.query.filter_by(id=gameid).first()

def create_new_game(userid):
    game = Games(player0id=userid,
                player1id="0",
                gameasjson= gameasjson,
                status="Open")
    db.session.add(game)
    db.session.commit()
    return game                

def join_game(username):
    user = get_user_by_username(username)
    if not user:
        return {"response", "User not found"}  
    if user.open_games >= MAX_OPEN_GAMES:
        return { "response": "All Slots filled" }
    game =  Games.query.filter(Games.player0id != user.id, Games.player1id == "0").first()
    if game:
        start_game(game, user)
        return { "response": "Joined New Game. Ready to play" }
    if not game:
        create_new_game(user.id)        
        return { "response": "New game created. Invite open." }

def end_game(game):
    if "gameasjson" in game:
        gameasjson = json.load(game["gameasjson"])
        gameasjson["status"] = "Ended"
        game["draw_proposed"] = None
        game["last_change"] = utc_time()
        game["gameasjson"] = gameasjson
        db.session.commit()

def start_game(game, user):
    game.time_started = utc_time()
    game.last_change = utc_time()
    game.status = "Playing"
    game.player1id = user.id  
    user.open_games += 1 
    db.session.commit()

def change_element_in_db(gameid, dict_of_changes):
    game = get_game_by_id(gameid)
    if game:
        for item, new_value in dict_of_changes.items():
            setattr(game, item, new_value)

def add_stat_to_user(userid, single_stat):
    user = get_user_by_id(userid)
    if user:
        original_stats = json.load(user["stats"])
        original_stats[single_stat] += 1
        user["stats"] = original_stats
        user["open_games"] -= 1
        db.session.commit()

def get_other_player(game, userid):
    if userid == game["player0id"]: return game["player1id"]
    if userid == game["player1id"]: return game["player0id"]

def add_statistics(game, draw, winner, loser):
    if draw:
        if game["player0id"] and game["player1id"]:
            add_stat_to_user(game["player0id"], "D")
            add_stat_to_user(game["player1id"], "D")
    if winner:
        add_stat_to_user(winner, "W")
        add_stat_to_user(get_other_player(game, winner), "L")
    if loser:
        add_stat_to_user(loser, "L")
        add_stat_to_user(get_other_player(game, loser), "W")    

def end_game_and_add_statistics(gameid, draw, winner, loser):
    game = get_game_by_id(gameid)
    if game:
        end_game(game)
        add_statistics(game, draw, winner, loser)

def create_db(app, database_url):
    db.init_app(app) 
    if not database_exists(database_url):
        with app.app_context():
            db.create_all()


