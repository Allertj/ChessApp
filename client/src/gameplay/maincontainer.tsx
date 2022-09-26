import React from 'react';
import { BoardContainer } from './boardcontainer'
import { Game } from '../chess/game'
import { XYString } from './board'
import { replacer } from '../misc/helper';
import { SocketCom } from './createsocket';
import { server } from '../config'
import { UserData, GameAsJson } from '../interfaces/interfaces'
// import { Socket } from "socket.io-client";

// import { SendProposeDraw, SendDrawAccepted, SendDrawDeclined, SendConcession, SendMove, SendInitiation, SendMoveVerified} from './createsocket'

const verifyMove = (unverified_move: string, id: string, game: Game, socketCom: SocketCom) => {
    let {x, y, destx, desty, sender, color} = JSON.parse(unverified_move)
    if (game.board[x][y] && sender === id) {
        game.makeMove(game.board, x, y, destx, desty, color)
        document.getElementById(XYString(destx, desty))?.click()         
    } else {
        let res = game.getPossibilities(color, x,  y, false).map(([x,y]: Array<number>)=> XYString(x,y))
        if (res.includes(XYString(destx, desty))) {
            game.makeMove(game.board, x, y, destx, desty, color)
            document.getElementById(XYString(destx, desty))?.click()
            let newmsg = {move: JSON.parse(unverified_move), 
                          gameasjson: JSON.stringify(game, replacer)}
            if (!socketCom) {return} 
            socketCom.SendMoveVerified(newmsg)             
        }
    }    
}

const MainContainer = (data: {gamedata: GameAsJson, userdata: UserData}) => {  
        const [drawproposed, setDrawProposed] = React.useState(() => {return false})
        const game = Object.assign(new Game(), data.gamedata)
        let socketCom = new SocketCom(data.userdata.accessToken, data.userdata.id, server)
        // let socket = React.useRef(createSocket(data.userdata.accessToken, data.userdata.id))
        React.useEffect(() => {
            if (data.gamedata.status === "Ended") {
                data.gamedata.unverified_move = undefined
                data.gamedata.color = 2
             }

        }, [data, game])     
        React.useEffect(() => {
            if (data.gamedata.unverified_move) {
                verifyMove(data.gamedata.unverified_move, data.userdata.id, game, socketCom)
             }

        }, [data, game])                  

        React.useEffect(() => {
            if (data.gamedata.draw_proposed && JSON.parse(data.gamedata.draw_proposed).sender !== data.userdata.id) {
                setDrawProposed(true)
            } 
        }, [data.gamedata.draw_proposed, data.userdata.id])

        React.useEffect(() => {
            socketCom.SendInitiation({gameid: game.id})           
        }, [game.id]);
                               
        const concede = () => {
            game.concedeGame()
            socketCom.SendConcession({gameid: game.id, 
                                            color: game.color, 
                                            sender: data.userdata.id})
        }
        const proposeDraw = () => {   
            socketCom.SendProposeDraw({gameid: game.id, 
                                              sender: data.userdata.id})
        }
        const drawAnswer = (drawAnswer: boolean) => {
            setDrawProposed(false)
            if (drawAnswer) {         
                socketCom.SendDrawAccepted({gameid: game.id, 
                                                  sender:data.userdata.id, 
                                                  gameasjson: JSON.stringify(game, replacer)})         
            } else {
                socketCom.SendDrawDeclined({gameid: game.id, 
                                                  sender:data.userdata.id})
            }
        }
        return (<BoardContainer game={game}
                                proposeDraw={proposeDraw}
                                drawAnswer={drawAnswer}
                                concede={concede}
                                socketCom={socketCom}
                                drawproposed={drawproposed}
                                setDrawProposed={setDrawProposed}
                                userid={data.userdata.id}/>)
}

export { MainContainer }