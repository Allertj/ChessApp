from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from database.db_functions import create_db, create_user
from credentials.initialize import authenticate

open = Blueprint("open_routes", __name__)

@open.route("/checkout")
def check_server():
    return "SERVER WORKING PROPERLY"

@open.route("/api/auth/signup", methods=["POST"])
def signup():
    username = request.json.get("username")
    password = request.json.get("password")
    email = request.json.get("email")
    message = create_user(username, password, email)
    return { "message": message }

@open.route("/api/auth/signin", methods=["POST"])
def signin():
    username = request.json.get("username")
    password = request.json.get("password")
    return authenticate(username, password)