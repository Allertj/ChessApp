import React from 'react';
import { Board , XYString, ReverseBoard } from './board';
import { SideBar } from '../items/sidebar'
import { replacer } from '../misc/helper'
import { Game } from '../chess/game'
import { Popup } from './promotion'
import { ProposeDraw } from './proposedraw';
import {SocketCom} from './createsocket'
// import { Socket } from "socket.io-client";
// import {status1} from '../chess/misc'
import { MSGPromotion, MSGProposeDraw, MSGDrawFinalized, MSGConcede, Move} from './createsocket'

interface BoardContainerProps {
    game: Game
    socketCom: SocketCom
    userid: string
    drawproposed: boolean
    proposeDraw: () => void
    drawAnswer: (drawAnswer: boolean) => void
    concede: () => void
    setDrawProposed: (state: boolean) => void
}

const BoardContainer = (gameid: BoardContainerProps) => {
    const [board, setBoard] = React.useState(() => {return gameid.game.board})
    const [highlighted, setHighlighted] = React.useState(() => {return gameid.game.last_selected})
    const [options, setOptions] = React.useState(() => {return gameid.game.latest_poss_as_string})
    const [status, setStatus] = React.useState(() => {return gameid.game.status})
    const [moves, setMoves] = React.useState(() => {return gameid.game.getMoves()})

    const verifyMove = (msg: Move) => {
        let res = gameid.game.getPossibilities(msg.color, msg.x, msg.y, false).map(([x,y]: Array<number>)=> XYString(x,y))
        if (res.includes(XYString(msg.destx, msg.desty))) {
            gameid.game.makeMove(gameid.game.board, msg.x, msg.y, msg.destx, msg.desty, gameid.game.color)
            document.getElementById(XYString(msg.destx, msg.desty))?.click()
            let newmsg = {move: msg, 
                          gameasjson: JSON.stringify(gameid.game, replacer)}
            gameid.socketCom.SendMoveVerified(newmsg)              
        }
    }
    React.useEffect(() => {
        gameid.socketCom.receiveOtherMove((msg: Move) => {
            verifyMove(msg)
        })
        gameid.socketCom.receivePromotion((msg: MSGPromotion) => {
            let {x, y, player, piece} = msg
            gameid.game.promotePiece(x, y, player, piece) 
            setStatus("Playing")
        })
        gameid.socketCom.receiveDrawPromotion((msg: MSGProposeDraw) => {
            gameid.setDrawProposed(true)
        })
        gameid.socketCom.receiveDrawFinalised((msg: MSGDrawFinalized) => {
            if (msg.result === "accepted") {
                setStatus("Draw")
                gameid.game.drawGame()
            }
        })
        gameid.socketCom.receiveConcession((msg: MSGConcede) => {
            setStatus("Other player has conceeded")
            gameid.game.concedeGame()
        })
    }, [gameid.socketCom.socket])

    const askPromotePiece = (piece: string) => {
        gameid.socketCom.SendPromotion({piece: piece, 
                                      gameid: gameid.game.id, 
                                      ...gameid.game.promotion})  
     }

    const updateFromBoard = ([x, y]: Array<number>) => {
        if (status === "Draw" || status === "Conceded" || status === "You have conceeded" || status === "Other player has conceeded") {return }
        if (!options.includes(XYString(x, y))) {
            gameid.game.getPossibilities(Number(gameid.game.color), x, y, false)
            
        } else {
            gameid.game.makeMove(gameid.game.board, highlighted[0],highlighted[1], x, y, gameid.game.color)
            gameid.socketCom.SendMove({x: highlighted[0], y: highlighted[1], destx: x, desty: y, 
                                    gameid: gameid.game.id, 
                                    gameasjson:JSON.stringify(gameid.game, replacer),
                                    color: gameid.game.color, 
                                    sender: gameid.userid})
        }       
        setBoard(gameid.game.board)
        setOptions(gameid.game.latest_poss_as_string)
        setHighlighted(gameid.game.last_selected)
        setStatus(gameid.game.status)
        setMoves(gameid.game.getMoves())
    }
    return <div className="flex-container"><SideBar moves={moves} 
                                                    concede={gameid.concede}
                                                    proposeDraw={gameid.proposeDraw}
                                                    setStatus={setStatus}
                                                    status={status}/> 
          <Popup openMenu={status === "Promotion" && gameid.game.promotion.player === gameid.game.color} 
                 askPromotePiece={askPromotePiece}/>  
          <ProposeDraw openMenu={gameid.drawproposed} drawAnswer={gameid.drawAnswer}/>                                               
        {gameid.game.color === 1 && <ReverseBoard board={board}
                                                  highlighted={highlighted}
                                                  options={options} 
                                                  status={status}
                                                  signalMove={updateFromBoard}/>}
        {gameid.game.color === 0 && <Board        board={board}
                                                  highlighted={highlighted}
                                                  options={options}
                                                  status={status} 
                                                  signalMove={updateFromBoard}/>}                                                
                                                  </div>
  }

export { BoardContainer } 