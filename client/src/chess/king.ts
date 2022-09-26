import { Piece} from './piece'
import { Player } from './misc'

class King extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "M")
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]];
        let possible : Array<[number, number]>  = [];
        poss.forEach(element => {
            if (element[0] + x >= 0 && element[1] + y >= 0 && element[0] + x <= 7 && element[1] + y <= 7) {
                if (board[element[0] + x][element[1] + y] === null || board[element[0] + x][element[1] + y]?.player !== this.player) {
                    possible.push([(element[0] + x), (element[1] + y)]);
                }
            }
        });
        return possible;
    }
    get letter() {
        return this.typeletter;
    }
}

export { King }