import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from database.db_functions import get_user_stats, join_game, get_all_games_from_user, get_game_by_id

closed = Blueprint("closed_routes", __name__)

def restructure_game(game):
    return {"_id": str(game.id), 
            "player0id": game.player0id, 
            "player1id": game.player1id, 
            "status": game.status, 
            "gameasjson": json.loads(game.gameasjson),
            "last_change": game.last_change,
            "time_started": game.time_started}

@closed.route("/newgame", methods=["POST"])
@jwt_required()
def create_or_join_game():
    username = request.json.get("username")   
    return join_game(username)

@closed.route("/profile/<int:userid>/stats", methods=["GET"])
@jwt_required()
def get_stats(userid):
    return get_user_stats(userid)

@closed.route("/profile/<int:userid>/open", methods=["GET"])
@jwt_required()
def get_open_games(userid):
    games = get_all_games_from_user(userid)
    return {"games": [restructure_game(game) for game in games]}

@closed.route("/profile/<int:userid>/closed", methods=["GET"])
@jwt_required()
def get_closed_games(userid):
    games = get_all_games_from_user(userid)
    return {"games": [restructure_game(game) for game in games if game.status =="Ended"]}

@closed.route("/requestgamedata/<int:gameid>", methods=["GET"])
@jwt_required()
def get_game_data(gameid):
    return restructure_game(get_game_by_id(gameid))