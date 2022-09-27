import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db_functions import get_user_stats, join_game, get_all_games_from_user, get_game_by_id

closed = Blueprint("closed_routes", __name__)

def restructure_game(game):
    return {"_id": str(game.id), 
            "player0id": game.player0id, 
            "player1id": game.player1id, 
            "status": game.status, 
            "result": game.result,
            "gameasjson": game.gameasjson,
            "last_change": game.last_change,
            "time_started": game.time_started}

@closed.route("/profile/<string:userid>/start", methods=["POST"])
@jwt_required()
def create_or_join_game(userid):
    return join_game(userid)

@closed.route("/profile/<string:userid>/stats", methods=["GET"])
@jwt_required()
def get_stats(userid):
    return get_user_stats(userid)

@closed.route("/profile/<string:userid>/open", methods=["GET"])
@jwt_required()
def get_open_games(userid):
    games = get_all_games_from_user(userid)
    userid_jwt =  str(get_jwt_identity())
    return { "games" : [restructure_game(game) 
                for game in games 
                    if (game.player0id == userid_jwt or game.player1id == userid_jwt)]}

@closed.route("/profile/<string:userid>/closed", methods=["GET"])
@jwt_required()
def get_closed_games(userid):
    games = get_all_games_from_user(userid)
    userid_jwt =  str(get_jwt_identity())
    return { "games" : [restructure_game(game) 
                for game in games 
                    if (game.status =="Ended" and 
                       (game.player0id == userid_jwt or game.player1id == userid_jwt))]}

@closed.route("/profile/<string:userid>/open/<string:gameid>", methods=["GET"])
@jwt_required()
def get_game_data2(userid, gameid):
    game = restructure_game(get_game_by_id(gameid))
    userid_jwt =  str(get_jwt_identity())
    if game["player0id"] == userid_jwt or game["player1id"] == userid_jwt:
        return game
    else:
        return { "msg" : "client is not a participant in this game."}    
