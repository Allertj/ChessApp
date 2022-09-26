import {Piece} from './piece'

enum Player { BLACK, WHITE}

enum status1 {PLAYING = "Playing", 
              CONCEDED = "Conceded",
              CHECKMATE = "Checkmate",
              DRAW = "Draw",
              PROMOTION = "Promotion", 
              CHECK = "Check", 
              STALEMATE = "Stalemate"}

const validNumbers = (x: number, y: number): boolean => {
    if (x >= 0 && y >= 0 && x <= 7 && y <= 7) {
        return true;
    }
    return false;
}

const linemakerCheck = (board: Array<Array<Piece | null>>, x: number, y: number, t1: number, t2: number, player:Player, piece: Array<string>) : boolean => {
    for (let i = 1; i < 8; i++) {
        if (x + (t1 * i) >= 0 && y + (t2 * i) >= 0 && x + (t1 * i) <= 7 && y + (t2 * i) <= 7) {
            if (board[x + (t1 * i)][y + (t2 * i)] !== null) {
                let current = board[x + (t1 * i)][y + (t2 * i)];
                if (current && current.player === player) { return false}
                if (current && current.player !== player) {
                    if (current.letter && !piece.includes(current.letter.toString())) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

const linemaker = (board: Array<Array<Piece | null>>, x: number, y: number, t1: number, t2: number, player: Player, piece: String = "") : Array<[number, number]> => {
    let possible : Array<[number, number]> = []
    for (let i = 1; i < 8; i++) {
        if (x + (t1 * i) >= 0 && y + (t2 * i) >= 0 && x + (t1 * i) <= 7 && y + (t2 * i) <= 7) {
            if (board[x + (t1 * i)][y + (t2 * i)] !== null) {
                let current = board[x + (t1 * i)][y + (t2 * i)];
                if (current?.player === player) {
                    break;
                }
                else {
                    possible.push([(x + (t1 * i)), (y + (t2 * i))]);
                    break;
                }
            }
            possible.push([(x + (t1 * i)), (y + (t2 * i))]);
        }
    }
    return possible;
};
export { Player, linemaker, linemakerCheck, validNumbers, status1}