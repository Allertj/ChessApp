import { Piece} from './piece'
import { Player, linemaker } from './misc'

class Queen extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "Q")
    }
    getMovements(board: Array<Array<Piece | null >>, x: number, y: number): Array<[number, number]> {
        let poss1 = linemaker(board, x, y, 1, 1, this.player);
        let poss2 = linemaker(board, x, y, -1, -1, this.player);
        let poss3 = linemaker(board, x, y, 1, -1, this.player);
        let poss4 = linemaker(board, x, y, -1, 1, this.player);
        let poss5 = linemaker(board, x, y, 0, 1, this.player);
        let poss6 = linemaker(board, x, y, 0, -1, this.player);
        let poss7 = linemaker(board, x, y, 1, 0, this.player);
        let poss8 = linemaker(board, x, y, -1, 0, this.player);
        return poss1.concat(poss2, poss3, poss4, poss5, poss6, poss7, poss8);
    }
    get letter() {
        return this.typeletter;
    }
}

export { Queen }