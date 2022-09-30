from flask_socketio import SocketIO, join_room, emit, disconnect
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, decode_token, exceptions
from jwt.exceptions import DecodeError
from database.db_functions import get_user_by_id, change_element_in_db, end_game_and_add_statistics, get_game_by_id
import json

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on('connect')
def verify_connection(message: dict):
    try:
        result = decode_token(message["token"])
        user = get_user_by_id(result['sub'])
        if result["type"] != "access" or user.id != message["id"]:
            disconnect()
    except(DecodeError, exceptions.NoAuthorizationError, exceptions.FreshTokenRequired):
        disconnect()

@socketio.on('initiate')
def player_joins_game(message: dict):
    gameid = str(message["gameid"])
    userid = message["sender"]
    game = get_game_by_id(gameid)
    if userid == game.player1id or userid == game.player0id:
        join_room(gameid)
        emit("user_connected", f"{userid} has connected to game {gameid}", broadcast=True, room=gameid, include_self=True)
    else:
        disconnect()    

@socketio.on('move')
def player_made_move(message: dict):
    gameid = str(message["gameid"])
    change_element_in_db(gameid, {"unverified_move": json.dumps(message)})
    emit("othermove", message, broadcast=True, room=gameid, include_self=False)

@socketio.on('promotion')
def player_made_a_promotion(message: dict):
    gameid = str(message["gameid"])
    emit("promotion_received", message, broadcast=True, room=gameid, include_self=False)

@socketio.on('propose_draw')
def player_proposed_draw(message: dict):
    gameid = str(message["gameid"])
    change_element_in_db(gameid, {"draw_proposed": json.dumps({"sender": message["sender"]})})
    emit("draw_proposed", message, broadcast=True, room=gameid, include_self=False)
        
@socketio.on('draw_accepted')
def player_accepted_draw(message: dict):
    gameid = str(message["gameid"])
    gameasjson = json.loads(message["gameasjson"])
    gameasjson["status"] = "Draw"
    sender = message["sender"]
    result = {"draw": "true", "by": "Proposal", "notes": f"accepted by {sender}"}
    change_element_in_db(gameid, {"result": json.dumps(result), 
                                  "status": "Ended", 
                                  "gameasjson": json.dumps(gameasjson),
                                  "draw_proposed": ""})
    emit("draw_finalised", json.dumps({"result": "accepted"}), broadcast=True, room=gameid, include_self=False)
    end_game_and_add_statistics(gameid, True, None, None)
                                  
@socketio.on('draw_declined')
def other_player_declined_draw(message: dict):
    gameid = str(message["gameid"])
    change_element_in_db(gameid, {"draw_proposed": ""})
    emit("draw_finalised", {"result": "declined"}, broadcast=True, room=gameid, include_self=False)     

@socketio.on('concede')
def player_conceded(message: dict):
    gameid = str(message["gameid"])
    result = {"draw": "false", "loser": message["sender"], "by": "Concession"}
    change_element_in_db(gameid,{"result": json.dumps(result)})
    end_game_and_add_statistics(gameid, False, None, message["sender"])
    emit("other_player_has_conceded", message, broadcast=True, room=gameid, include_self=False)            

@socketio.on('move_verified')
def move_was_verified(message: dict):
    gameid = str(message["move"]["gameid"])
    current_game = json.loads(message["move"]["gameasjson"])
    if current_game["status"] == "Checkmate":
        result = json.dumps({"draw": "false", "winner": message["move"]["sender"], "by": "Checkmate"})
        value = {"result": result, "status": "Ended"}
        change_element_in_db(message["move"]["gameid"], value)
        end_game_and_add_statistics(gameid, False, message["sender"], None)
        return
    if current_game["status"] == "Stalemate":     
        value = {"result": json.dumps({"draw": "true", "by": "Stalemate"}), "status": "Stalemate"}
        change_element_in_db(message["move"]["gameid"], value)
        end_game_and_add_statistics(gameid, True, None, None)
        return
    game = get_game_by_id(gameid)
    print("CLEARED 1")
    print(json.loads(game.unverified_move))
    # if game.unverified_move == str(message["move"]):
    if True:
        change_element_in_db(message["move"]["gameid"], {"gameasjson": message["gameasjson"], "unverified_move": None})
