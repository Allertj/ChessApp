import {Player} from './misc'

export abstract class Piece {
    x: number;
    y: number;
    moved: boolean = false
    player: Player
    typeletter: string
    constructor(x: number, y: number, player: Player, moved: boolean = false, typeletter: string) {
        this.x = x
        this.y = y
        this.moved = moved
        this.player = player
        this.typeletter = typeletter
    }
    abstract getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]>
    abstract get letter() : String    
}

