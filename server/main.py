import os
import eventlet
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from database.db_functions import create_db
from sockets.sockets import socketio
from routing.closed_routes import closed
from routing.open_routes import open

load_dotenv()

app = Flask(__name__)
database_url = 'sqlite:///database/db.sqlite'
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_HEADER_NAME"] = "x-access-token"
app.config["JWT_HEADER_TYPE"] = ""
app.config['SECRET_KEY'] = str(os.environ.get("SECRET KEY"))
app.config["JWT_SECRET_KEY"] = str(os.environ.get("JWT_SECRET KEY"))

CORS(app)
create_db(app, database_url)
jwt = JWTManager(app)
socketio.init_app(app)
app.register_blueprint(open)
app.register_blueprint(closed)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port= int(os.environ.get("BACKEND_PORT")))
    eventlet.wsgi.server(eventlet.listen(("0.0.0.0",  int(os.environ.get("BACKEND_PORT")))), app)