from flask_socketio import SocketIO, join_room, emit, disconnect
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, decode_token, exceptions
from jwt.exceptions import DecodeError
from database.db_functions import get_user_by_username, change_element_in_db, end_game_and_add_statistics
import json

socketio = SocketIO()

@socketio.on('connect')
def verify_connection(message):
    try:
        result = decode_token(message["token"])
        user = get_user_by_username(result['sub'])
        if result["type"] != "access" or user.id != message["id"]:
            disconnect()
    except(DecodeError, exceptions.NoAuthorizationError, exceptions.FreshTokenRequired):
        disconnect()

@socketio.on('initiate')
def player_joins_game(message):
    gameid = str(message["gameid"])
    join_room(gameid)
    emit("connectaaa", f"connected to ${gameid}", broadcast=True, room=gameid, include_self=True)

@socketio.on('move')
def player_made_move(message):
    gameid = str(message["gameid"])
    change_element_in_db(gameid, {"unverified_move": str(message)})
    emit("othermove", message, broadcast=True, room=gameid, include_self=False)

@socketio.on('promotion')
def player_made_a_promotion(message):
    gameid = str(message["gameid"])
    emit("promotion_received", message, broadcast=True, room=gameid, include_self=False)

@socketio.on('propose_draw')
def player_proposed_draw(message):
    gameid = str(message["gameid"])
    change_element_in_db(gameid, {"draw_proposed": str({"sender": message["sender"]})})
    emit("draw_proposed", message, broadcast=True, room=gameid, include_self=False)
        
@socketio.on('draw_accepted')
def player_accepted_draw(message):
    gameid = str(message["gameid"])
    gameasjson = json.load(message["gameasjson"])
    gameasjson["status"] = "Draw"
    sender = message["sender"]
    change_element_in_db(gameid, {"result": str({"draw": True, "by": "Proposal", "notes": f"accepted by ${sender}"}), 
                                  "status": "Ended", 
                                  "gameasjson": str(gameasjson),
                                  "draw_proposed": ""})
    emit("draw_finalised", str({"result": "accepted"}), broadcast=True, room=gameid, include_self=False)
    end_game_and_add_statistics(gameid, True, None, None)
                                  
@socketio.on('draw_declined')
def other_player_declined_draw(message):
    gameid = str(message["gameid"])
    change_element_in_db(gameid, {"draw_proposed": ""})
    emit("draw_finalised", {"result": "declined"}, broadcast=True, room=gameid, include_self=False)     

@socketio.on('concede')
def player_proposed_draw(message):
    gameid = str(message["gameid"])
    change_element_in_db(gameid,{"result": str({"draw": "false", "loser": message["sender"], "by": "Concession"}), "status": "Ended"})
    end_game_and_add_statistics(gameid, False, None, message["sender"])
    emit("other_player_has_conceded", message, broadcast=True, room=gameid, include_self=False)            

@socketio.on('move_verified')
def player_proposed_draw(message):
    gameid = str(message["gameid"])
    current_game = json.load(message["gameasjson"])
    if current_game["status"] == "Checkmate":
        value = {"result": str({"draw": "false", "winner": message["move"]["sender"], "by": "Checkmate"}), "status": "Ended"}
        change_element_in_db(message["move"]["gameid"], value)
        end_game_and_add_statistics(gameid, False, message["sender"], None)
        return
    if current_game["status"] == "Stalemate":     
        value = {"result": str({"draw": "true", "by": "Stalemate"}), "status": "Stalemate"}
        change_element_in_db(message["move"]["gameid"], value)
        end_game_and_add_statistics(gameid, True, None, None)

#         runFunctionOnGame(msg.move.gameid, (game: any) => {
#           if (game.unverified_move && JSON.stringify(msg.move) === game.unverified_move) {   
#             editGame(msg.move.gameid, {gameasjson: msg.gameasjson, unverified_move: ""})
#           }
#         })
#         });
#     });
#   }    