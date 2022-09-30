# import eventlet
# import os
# from flask import Flask
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager

# from database.db_functions import create_db, create_user
# from sockets.sockets import socketio
# from routing.closed_routes import closed
# from routing.open_routes import open
# from werkzeug.security import generate_password_hash, check_password_hash, safe_str_cmp



# # from myapp import create_app, db

# def create_app():
#     app = Flask(__name__)
#     database_url = 'sqlite:///db.sqlite'
#     app.config['SQLALCHEMY_DATABASE_URI'] = database_url
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#     app.config["JWT_HEADER_NAME"] = "x-access-token"
#     app.config["JWT_HEADER_TYPE"] = ""
#     app.config['SECRET_KEY'] = str(os.environ.get("SECRET KEY"))
#     app.config["JWT_SECRET_KEY"] = str(os.environ.get("JWT_SECRET KEY"))
#     CORS(app)
#     create_db(app, database_url)
#     jwt = JWTManager(app)
#     socketio.init_app(app)
#     app.register_blueprint(open)
#     app.register_blueprint(closed)
#     return app

# class MyTest(TestCase):

#     SQLALCHEMY_DATABASE_URI = "sqlite://"
#     TESTING = True

#     def create_app(self):

#         # pass in test configuration
#         return create_app(self)

#     def setUp(self):

#         db.create_all()

#     def tearDown(self):

#         db.session.remove()
#         db.drop_all()


# # class TestCases(unittest.TestCase):
# #     def test_create_user(self):
# #         value = create_user("TestUser", "TestPassword", "TestEmail")
# #         hash = generate_password_hash("TestPassword")
# #         self.assertEqual("User was registered successfully", value)


# # if __name__ == '__main__':
# #     host = "0.0.0.0"
# #     port = 5656
# #     app = create_app()
# #     # with app.app_context():
# #         # db.create_all()
# #     # with app.con
# #     # eventlet.wsgi.server(eventlet.listen((host, port)), app)  
# #     unittest.main()    