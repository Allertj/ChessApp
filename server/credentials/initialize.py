from werkzeug.security import check_password_hash
from database.db_functions import get_user_by_username
from flask_jwt_extended import create_access_token

def authenticate(username, password):
    user = get_user_by_username(username)
    if not user:
        return {"message": "Unknown user"}
    if check_password_hash(user.password, password):
        return {"id":    user.id,
                "stats": user.stats,
                "username": user.username,
                "email": user.email,
                "open_games": user.open_games,
                "roles": ["User"],
                "accessToken": create_access_token(username)}
    return {"message": "Invalid password"}    