import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db_functions import get_user_stats, join_game, get_all_games_from_user, get_game_by_id
from database.models import Games

closed = Blueprint("closed_routes", __name__)

def restructure_game(game: Games):
    result = lambda result: json.loads(result) if result else ""
    return {"_id": str(game.id), 
            "player0id": str(game.player0id), 
            "player1id": str(game.player1id), 
            "status": game.status, 
            "result": result(game.result),
            "gameasjson": game.gameasjson,
            "last_change": game.last_change,
            "unverified_move": game.unverified_move,
            "draw_proposed": game.draw_proposed,
            "time_started": game.time_started}

@closed.route("/profile/<string:userid>/start", methods=["POST"])
@jwt_required()
def create_or_join_game(userid: str):
    return join_game(userid)

@closed.route("/profile/<string:userid>/stats", methods=["GET"])
# @jwt_required()
def get_stats(userid: str):
    aa = get_user_stats(userid)
    return aa

@closed.route("/profile/<string:userid>/open", methods=["GET"])
@jwt_required()
def get_open_games(userid: str):
    games = get_all_games_from_user(userid)
    userid_jwt =  get_jwt_identity()
    return { "games" : [restructure_game(game) 
                for game in games 
                    if (game.status != "Ended" and 
                    (game.player0id == userid_jwt or game.player1id == userid_jwt))]}

@closed.route("/profile/<string:userid>/closed", methods=["GET"])
@jwt_required()
def get_closed_games(userid: str):
    games = get_all_games_from_user(userid)
    userid_jwt = get_jwt_identity()
    games =  { "games" : [restructure_game(game) 
                for game in games 
                    if (game.status =="Ended" and 
                       (game.player0id == userid_jwt or game.player1id == userid_jwt))]}

    return games

@closed.route("/profile/<string:userid>/open/<string:gameid>", methods=["GET"])
@jwt_required()
def get_single_game_data(userid: str, gameid: str):
    game = restructure_game(get_game_by_id(gameid))
    userid_jwt = str(get_jwt_identity())
    if game["player0id"] == userid_jwt or game["player1id"] == userid_jwt:
        return game
    else:
        return { "msg" : "client is not a participant in this game."}    