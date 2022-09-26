import { Piece } from './queen'
import { useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {Piece as PieceClass} from '../chess/piece'

const figures = [new Map([["Q", "♕"], ["M", "♔"], ["R", "♖"],["K", "♘"], ["B", "♗"], ["P", "♙"]]),
                 new Map([["Q", "♛"], ["M", "♚"], ["R", "♜"],["K", "♞"], ["B", "♝"], ["P", "♟"]])
                 ]
              
const XY = (target : string) => {
    return [Number(target[1]), Number(target[2])]
}

const baseCell = (x : number, y : number) => {
    if ((x % 2 === 0 && y % 2 === 1) || (y % 2 === 0 && x % 2 === 1)) {
        return "black unselectable field" 
    } else { 
        return "white unselectable field" 
    }   
}

const XYString = (x: number, y: number) => {
    return x.toString() + y.toString()
}

const Construct = (x: number, y: number, row: React.ReactElement[], data: any) => {
    let id = XYString(x,y)   
    let highlight = (data.highlighted[0] && XYString(data.highlighted[0], data.highlighted[1]) === id) ? " currentlyselected" : ""
    let option = (data.options.includes(id)) ? " options" : ""
    let base = baseCell(x,y);
    let piece = data.board[x][y] ? figures[data.board[x][y]?.player].get(data.board[x][y].letter) : ""

    row.push(<Cell  key={id} 
                    id={id}  
                    drops={data.options.includes(id)}
                    classes={base+highlight+option}
                    signalMove={data.signalMove}
                    piece={piece}/>)
    return row                
}

interface BoardProps {
    board: Array<Array<PieceClass | null>>
    highlighted: number[]
    options: Array<string>
    signalMove: (data: Array<any>) => void
    status: string
}
    
interface CellProps {
    classes: string
    drops: boolean
    id: string
    key: string
    piece: string | undefined
    signalMove: (data: Array<any>) => void
}
    
const Board = (data: BoardProps) => {
    let fulltable = []
    for (let x = 0; x < data.board.length; x++) {
        let row : Array<any> = []
        for (let y = 0; y < 8; y++) {
            Construct(x, y, row, data)
        }
        fulltable.push([<tr key={"a"+x}><td>{x+1}</td>{[...row]}</tr>])        
    }
    return (<div id="board"><DndProvider debugMode={true} backend={HTML5Backend}><table><tbody>
                                <tr><th></th><th>H</th><th>G</th><th>F</th><th>E</th>
                                             <th>D</th><th>C</th><th>B</th><th>A</th></tr>
                             {[...fulltable]}</tbody></table></DndProvider></div>)
}

const ReverseBoard = (data: BoardProps) => {
    let fulltable = []
    for (let x = 7; x > -1; x--) {
        let row : Array<any> = []
        for (let y = 7; y > -1; y--) {
            Construct(x, y, row, data)
        }
        fulltable.push([<tr key={"a"+x}><td>{x+1}</td>{[...row]}</tr>])        
    }
    return (<div id="board"><DndProvider backend={HTML5Backend}><table><tbody>
                                <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th>
                                             <th>E</th><th>F</th><th>G</th><th>H</th></tr>
                             {[...fulltable]}</tbody></table></DndProvider></div>)
}

const Cell = (data: CellProps) => {
    const click = () => {
        data.signalMove(XY(" " + data.id))
    }
    const dummy = (data1: string) => {
        data.signalMove(XY(" " + data1))
    }
    const [, drop] = useDrop(
        () => ({
          accept: "Piece",
          drop: () => data.signalMove(XY(" " + data.id)),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
          })
        }),
        [data]
      )
    return (<td ref={data.drops ? drop : null}
                key={data.id} 
                id={data.id} 
                onClick={click} 
                className={data.classes}><Piece clickfunc={dummy} id={data.id} typeletter="Piece" piece={data.piece}/>
                    </td>

            )
}

export { Board, XYString, ReverseBoard, XY } 