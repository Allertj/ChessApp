import { Piece} from './piece'
import { Player } from './misc'

class Knight extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "K")
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss = [[2, -1], [2, 1], [-2, -1], [-2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
        let possible: Array<[number, number]> = [];
        poss.forEach(element => {
            if (element[0] + x >= 0 && element[1] + y >= 0 && element[0] + x <= 7 && element[1] + y <= 7) {
                let loc = board[element[0] + x][element[1] + y];
                if (loc && loc.player === this.player) { }
                else {
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

export {Knight}