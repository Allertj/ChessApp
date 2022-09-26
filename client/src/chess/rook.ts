import { Piece} from './piece'
import { Player, linemaker } from './misc'

class Rook extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "R")
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss1 = linemaker(board, x, y,  0,  1, this.player);
        let poss2 = linemaker(board, x, y,  0, -1, this.player);
        let poss3 = linemaker(board, x, y,  1,  0, this.player);
        let poss4 = linemaker(board, x, y, -1,  0, this.player);
        return poss1.concat(poss2, poss3, poss4);
    }
    get letter() {
        return this.typeletter;
    }
}

export { Rook }