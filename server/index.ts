import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

let app = express();
let server = http.createServer(app)
if (process.env.USE_SSL_IN_BACKEND === "true") {
  const privateKey = fs.readFileSync(process.env.SSL_KEY_FILE as string, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CRT_FILE as string, 'utf8');
  let options ={
    key: privateKey,
    cert: certificate
  }
  server = https.createServer(options, app)
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//Add Routes
import {authRoutes} from './routes/auth.routes'
import {userRoutes} from './routes/user.routes'
import {chessRoutes} from './routes/chess.routes'

authRoutes(app)
userRoutes(app)
chessRoutes(app)

//Add Socket
import { Server} from 'socket.io'
import { startSocket, enableVerification } from './socket/sockethandler'
const io = new Server(server, {cors: {origin: "*"}})
// const socketAdapter = new SocketAdapter(io)
enableVerification(io)
startSocket(io)

// Start database
import { initial } from './initiatedb'
import { db } from './models'

db.mongoose
    .connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

server.listen(process.env.REACT_APP_BACKEND_PORT, ()=>{
  console.log("Application running successfully on port: "+process.env.REACT_APP_BACKEND_PORT);
});

