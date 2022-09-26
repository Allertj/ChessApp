# ChessApp

I wanted to polish up my knowledge of Node, React, Sockets, noSQL-databases like MongoDB, Typescript and Docker, so I created something which uses all these things: ChessApp. This app has a very basic look, because the looks were not the point. You can register as a user and then open invites to games, or join other chess games. The chess engine has all the basic chess rules, notes the moves, and is interactive if both users have the same game open at the same time. 

The frontend uses React, the backend Node with MongoDB, and SocketIO is mainly used to communicate between these two. When a move is made it is send to the server and then send to the other user. This happens immediatly when the opponent is playing, or the move is stored and then transmitted when the opponent opens the game. The game instance of opponent checks and verifies the move which is then permanently stored in the backend. This means that the backend is only responsible for the sockets and the database, and not the game logic which happens only in the clients. All traffic between the backend and frontend uses JSONWebtoken to verify its validity. 

### Build instructions
All the important variables are stored in the .env file in the root. The first block should always be uncommented. To use the development variables uncomment the next block. If you use these, a MongoDB instance is expected to run on the local machine. Use "npm run dev" to start both the front- and backends. 

You can also use production variables. This variant uses Docker and Docker-compose to easily start, and has its own MongoDB container. Comment out the development block in the .env file, uncomment the "production variables" block. If you want to use SSL-certificates comment out that block and provide your own certificates in the ssl directory, and possibly change them in the .env file. To build use "docker-compose build". In rare cases an access error is thrown, which can be solved by using "sudo docker-compose build" if you are using Linux. 

*Don't forget to change the 'REACT_APP_SECRET' in the .env file into a secure, long string as this is vital for security.*

After the build process is complete, run "docker-compose up". Three docker containers, the frontend, backend and the mongo database should come online. Use "localhost:{PRODUCTION_PORT}" to visit the app. 

### Unittests
Unittests are provided for all socket and database operations on the backend and are implemented in Jest. They can be found in "server/tests". Run "npm test" to use them. 