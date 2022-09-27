# ChessApp
I wanted to polish up my knowledge of Flask, React, Sockets, Typescript and Docker, so I created something which uses all these things: ChessApp. This app has a very basic look, because the looks were not the point. You can register as a user and then open invites to games, or join other chess games. The chess engine has all the basic chess rules, notes the moves, and is interactive if both users have the same game open at the same time. 

### Architecture
The frontend uses React, the backend Flask with SQLite, and SocketIO is mainly used to communicate between these two. When a move is made it is send to the server and then send to the other user. This happens immediatly when the opponent is playing, or the move is stored and then transmitted when the opponent opens the game. The game instance of opponent checks and verifies the move which is then permanently stored in the backend. This means that the backend is only responsible for the sockets and the database, and not the game logic which happens only in the clients. All traffic between the backend and frontend uses JSONWebtoken to verify its validity. 

### Project Structure
The client and the server can be used completely stand-alone, if you just use the dockerfile which are located in each respective directory. All files which are not part of these directories are important to the entire app. 

### Development
All the important variables are stored in the .env file in the root. When in development you can start the frontend with "npm run start" and the backend with "python3.x main.py". You can also build seperate Docker containers for each. 

### Build instructions
You can also use production variables. This variant uses Docker and Docker-compose to easily start the entire app. There is an unsafe HTTP and a safe HTTPS variant. The first is the default one. To change to HTTPS, put a secure private and public key into the ssl directory, comment out the *production variables without ssl* and uncomment the 
*production variables with ssl*. 

To build use "docker-compose build". In rare cases an access error is thrown, which can be solved by using "sudo docker-compose build" if you are using Linux. 

*Don't forget to change the 'REACT_APP_SECRET', "JWT-SECRET-KEY" and "SECRET-KEY" values in the .env file into secure, long strings as this is vital for security.*

After the build process is complete, run "docker-compose up". Two docker containers, the frontend, backend should come online. Use "localhost:{PRODUCTION_PORT}" to visit the app. 

### Unittests
Unittests are provided for all socket and database operations on the backend and are implemented in Jest. They can be found in "server/tests". Run "npm test" to use them. 