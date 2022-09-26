import { Piece } from './piece'
import { status1, linemakerCheck, Player} from './misc'
import { King } from './king'
import { Queen } from './queen'
import { Rook } from './rook'
import { Bishop } from './bishop'
import { Knight } from './knight'
import { Pawn } from './pawn'
import { MoveNotation} from '../interfaces/interfaces'

class Game {
    board : Array<Array<Piece | null>> = []
    turn : Player = Player.WHITE
    id : string = "0"
    color: number = 2
    status: string = status1.PLAYING
    passed_pawn = new Map()
    passed_pawn_removal = new Map()
    castling = new Map()
    promotion = {x : 8, y : 8, player : 2}
    latest_poss: Array<[number, number]>= []
    moves : Array<Array<any>>= []
    movescount = 0
    last_selected : Array<number>= []
    constructor(gameInfo:any = null) {
        if (this.board.length === 0) {
            this.buildBoard(gameInfo)
        }
    }
    get currentStatus() {
        return this.status;
    }
    get last_selected_as_string() {
        return this.last_selected ?  this.last_selected[0].toString()+this.last_selected[1].toString() : ""
    }
    get latest_poss_as_string () {
        return this.latest_poss.map(value => value[0].toString()+value[1].toString())
    }
    concedeGame() {
        this.status = status1.CONCEDED
    }
    drawGame() {
        this.status = status1.DRAW
    }
    getMoves() : Array<MoveNotation>{
        let result: Array<MoveNotation> = []
        let players = new Map([[Player.WHITE, "WHITE"], [Player.BLACK, "BLACK"]])
        // let players = new Map([[1, "WHITE"], [0, "BLACK"]])
        let letter = new Map([[7, "A"], [6, "B"], [5, "C"], [4, "D"], [3, "E"], [2, "F"], [1, "G"], [0, "H"]])
        for (let [player, x, y, destx, desty,, strike, piece] of this.moves) {
            let notation = letter.get(y)+(x+1).toString()+strike+letter.get(desty)+(destx+1).toString()
            if (Math.abs(y-desty) === 3 && piece === "M") { notation = "0-0" } 
            if (Math.abs(y-desty) === 4 && piece === "M") { notation = "0-0-0" }
            else { 
                result.push({player: players.get(player) as string, 
                             piece: piece, 
                             notation: notation})
            }             
        }
        return result
    }
    getPossibilities(player: Player, x: number, y: number, forlegal: boolean) {
        if (this.status === status1.DRAW) {return []}
        if (!forlegal) { if (Number(player) === Number(this.turn)) {return []}}
        let temp : Array<[number, number]>= [];
        if (this.board[x][y] && this.board[x][y]?.player === player) {
            let poss = this.board[x][y]?.getMovements(this.board, x, y);
            if (this.passed_pawn.has([x, y].join(","))) {
                poss?.push(this.passed_pawn.get([x, y].join(",")));
            }
            poss?.forEach(value => {
                if (this.moveLegal(this.board, x, y, value[0], value[1], player)) {
                    temp.push(value);
                }
            });
            if (this.board[x][y]?.letter === "M") {
                let result = this.checkCastling(this.board, x, y, player);

                result.forEach(value => temp.push(value));
            }
        }
        if (!forlegal) {
            this.latest_poss = temp
            this.last_selected = [x, y]
        }
        return temp;
    }
    moveLegal(board: Array<Array<Piece | null>>, x: number, y: number, destx: number, desty: number, player: Player) {
        let temp = board[x][y];
        let dd;
        delete board[x][y];
        if (temp) { [temp.x, temp.y] = [destx, desty] };
        if (board[destx][desty]) {
            dd = board[destx][desty];
        }
        board[destx][desty] = temp;
        let aa = this.checkForCheck(player, board);
        board[x][y] = temp;
        if (temp) {  [temp.x, temp.y] = [x, y];}    
        board[destx][desty] = null;
        if (dd) {
            board[destx][desty] = dd;
        }
        return !aa;
    }
    checkIfAnyLegalMove(player: Player) {
        for (let piece of this.board.flat()) {
            if (piece && piece.player !== player) {
                let movements = this.getPossibilities(piece.player, piece.x, piece.y, true);
                if (movements.length > 0) {
                    return true;
                }
            }
        }
        return false;
    }
    checkStatus(player: Player) {
        let checkPlayer = 1 - this.turn;
        let inCheck = this.checkForCheck(checkPlayer, this.board);
        let legalMoves = this.checkIfAnyLegalMove(player);
        let drawByToFewPiece = this.checkPieceAmount(this.board);
        let drawByRepetition = this.drawByRepetition()
        switch (true) {
            case (drawByRepetition === true): return status1.DRAW;
            case (drawByToFewPiece === true): return status1.DRAW;
            case (inCheck === true && legalMoves === false):  return status1.CHECKMATE;
            case (inCheck === false && legalMoves === false): return status1.STALEMATE;
            case (inCheck === true && legalMoves === true):   return status1.CHECK;
            default: return status1.PLAYING;
        }
    }
    movePossible(x: number, y: number, destx: number, desty: number) {
        let movements = this.board[x][y]?.getMovements(this.board, x, y) 
        for (let move of (movements || [])) {
            if (move[0] === destx && move[1] === desty) {
                return true;
            }
        }
        return false;
    }
    checkPromotion(piece: Piece) {
        if (piece && piece.letter === "P") {
            if (piece.player === Player.WHITE && piece.x === 7) {
                [this.promotion.x, this.promotion.y, this.promotion.player] = [piece.x, piece.y, piece.player];
                this.status = status1.PROMOTION;
            }
            if (piece.player === Player.BLACK && piece.x === 0) {
                [this.promotion.x, this.promotion.y, this.promotion.player] = [piece.x, piece.y, piece.player];
                this.status = status1.PROMOTION;
            }
        }
    }
    checkPassedPawn(x: number, y: number, destx: number, desty: number, player: Player) {
        if (Math.abs(destx - x) === 2 && this.board[destx][desty - 1] && this.board[destx][desty - 1]?.player !== player) {
            this.passed_pawn.set([destx, desty - 1].join(","), [(destx + x) / 2, desty]);
            this.passed_pawn_removal.set([(destx + x) / 2, desty].join(","), [destx, desty]);
        }
        if (Math.abs(destx - x) === 2 && this.board[destx][desty + 1] && this.board[destx][desty + 1]?.player !== player) {
            this.passed_pawn.set([destx, desty + 1].join(","), [(destx + x) / 2, desty]);          
            this.passed_pawn_removal.set([(destx + x) / 2, desty].join(","), [destx, desty]);
        }
    }
    makeMoveInternal(board: Array<Array<Piece | null>>, x: number, y: number, destx: number, desty: number) {
        let temp = board[x][y];
        board[x][y] = null;
        if (temp) { 
            [temp.x, temp.y] = [destx, desty] 
            board[destx][desty] = temp;
            temp.moved = true
        }
        this.passed_pawn.clear();
        this.passed_pawn_removal.clear()
    }
    makeCastling(x: number, y: number, destx: number, desty: number) {
        let rookmovement = new Map([[0, 2], [7, 5]]);
        let kingmovement = new Map([[0, 1], [7, 6]]);
        this.makeMoveInternal(this.board, destx, desty, destx, rookmovement.get(desty) as number);
        this.makeMoveInternal(this.board, x, y, destx, kingmovement.get(desty) as number);
    }
    makeMove(board: Array<Array<Piece | null>>, x: number, y: number, destx: number, desty: number, player: Player) {
        this.latest_poss = []
        this.last_selected = []
        this.movescount += 1
        let strike = board[destx][desty] ? " X " : " - "
        this.moves.push([this.board[x][y]?.player, x, y, destx, desty, this.movescount, strike, this.board[x][y]?.letter])
        // if (player !== this.turn) { return false; }
        if (this.passed_pawn.has([x, y].join(",")) && board[x][y]?.letter === "P") {
            if (this.passed_pawn.get([x, y].join(",")).join(",") === [destx, desty].join(",")) {
                let [x1, y1] = this.passed_pawn_removal.get([destx, desty].join(","))
                board[x1][y1] = null
            }
        }
        if (this.castling.has([destx, desty].join(","))) {
            this.makeCastling(x, y, destx, desty);

            this.turn = 1 - this.turn;
            this.castling.clear();
            return true;
        }
        this.makeMoveInternal(this.board, x, y, destx, desty);
        this.turn = 1 - this.turn;
        this.latest_poss = []
        this.last_selected = []
        this.status = this.checkStatus(this.turn);
        if (board[destx][desty] && board[destx][desty]?.letter === "P") {
            this.checkPromotion(board[destx][desty] as Piece);
            this.checkPassedPawn(x, y, destx, desty, player);
        }
    }
    validNumbers(x: number, y: number) {
        if (x >= 0 && y >= 0 && x <= 7 && y <= 7) {
            return true;
        }
        return false;
    }
    checkCastling(board: Array<Array<Piece | null>>, x: number, y: number, player: Player) : Array<[number, number]>{
        let possible : Array<[number, number]> = [];
        if (!board[x][y]?.moved && (board[x][y + 4] || board[x][y - 3])) {
            if (board[x][y + 4] && board[x][y + 4]?.constructor.name === "Rook" && board[x][y + 4]?.moved === false) {
                if (board[x][y + 1] === null && board[x][y + 2] === null && board[x][y + 3] === null) {
                    let rookmove = this.moveLegal(this.board, x, y + 4, x, y + 3, player);
                    let kingmove = this.moveLegal(this.board, x, y, x, y + 2, player);
                    if (rookmove && kingmove) {
                        this.castling.set([x, y + 4].join(","), [x, y]);
                        possible.push([x, y + 4]);
                    }
                }
            }
            if (board[x][y - 3] && board[x][y - 3]?.constructor.name === "Rook" && board[x][y - 3]?.moved === false) {
                if (board[x][y - 1] === null && board[x][y - 2] === null) {
                    let rookmove = this.moveLegal(this.board, x, y - 3, x, y - 1, player);
                    let kingmove = this.moveLegal(this.board, x, y, x, y - 2, player);
                    if (rookmove && kingmove) {
                        this.castling.set([x, y - 3].join(","), [x, y]);
                        possible.push([x, y - 3]);
                    }
                }
            }
        }
        return possible;
    }
    checkForCheck(player: Player, board:Array<Array<Piece | null>>) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < 8 ; i++) {
            for (let j = 0; j < 8 ; j++) {
                let piece = board[i][j]
                if (piece && piece.letter === "M" && piece.player === player) {

                    [x, y] = [piece.x, piece.y];
                }
            }
        }
        let rqposs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let [px, py] of rqposs) {
            if (linemakerCheck(board, x, y, px, py, player, ["R", "Q"])) {
                return true;
            }    
        }
        let bqposs = [[1, -1], [-1, 1], [-1, -1], [1, 1]];
        for (let [px, py] of bqposs) {
            if (linemakerCheck(board, x, y, px, py, player, ["B", "Q"])) {
                return true;
            }   
        }    
        let strikes1 = [[[x - 1, y - 1], [x - 1, y + 1]], [[x + 1, y - 1], [x + 1, y + 1]]]
        for (let [x1, y1] of strikes1[player]) {
            if (this.validNumbers(x1, y1)) {
                if (board[x1][y1] && board[x1][y1]?.letter === "P" && board[x1][y1]?.player !== player) {
                    return true
                }
            }
        }                        
        let poss = [[2, -1], [2, 1], [-2, -1], [-2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
        for (let [kx, ky] of poss) {
            if (this.validNumbers(kx + x, ky + y)) {
                if (board[kx + x][ky + y] && board[kx + x][ky + y]?.letter === "K" && board[kx + x][ky + y]?.player !== player) {
                    return true
                }
            }   
        }
        return false;
    }
    getPiece(x: number, y: number) {
        return this.board[x][y]
    }
    static getInstanceOfPiece(x: number, y: number, letter: string, player: Player, moved: boolean) {
        switch (letter) {
            case "R": return new Rook(x, y, player, moved);
            case "B": return new Bishop(x, y, player, moved);
            case "Q": return new Queen(x, y, player, moved);
            case "K": return new Knight(x, y, player, moved);
            case "M": return new King(x, y, player, moved);
            case "P": return new Pawn(x, y, player, moved);
            default : return null
        }
    }
    getColorOfField = (x : number, y : number) => {
        if ((x % 2 === 0 && y % 2 === 1) || (y % 2 === 0 && x % 2 === 1)) {
            return "black" 
        } else { 
            return "white" 
        }   
    }
    checkPieceAmount(board: Array<Array<Piece | null>>) {
        let count : Array<Piece>= []
        for (let i of board.flat()) {
            if (i) 
                count.push(i)
            if (count.length > 4) {
                return false
            }    
        }   
        if (count.length === 4) {
            let bishops = count.filter(e => e.typeletter === 'B')
            let bishopsblack = count.filter(e => this.getColorOfField(e.x, e.y) === "black")
            let bishopswhite = count.filter(e => this.getColorOfField(e.x, e.y) === "white")
            if (bishops.length === 2 && (bishopswhite.length === 2 || bishopsblack.length === 2)) {
                return true
            }
            return false
        }
        if (count.length === 3) {
            if (count.some(e => e.typeletter === 'Q' || e.typeletter === 'R')) {
                return false
            }
        }
        return true
    }
    drawByRepetition(){
        let moves = new Map()
        for (let i of this.moves) {
            let move = `${i[0]}${i[1]}${i[2]}${i[3]}${i[4]}`
            if (!moves.has(move)) {
                 moves.set(move, 1)
            } else {
                moves.set(move, moves.get(move)+1)
                if (moves.get(move) === 3) {
                    return true
                }
            }
        }
        return false
    }
    promotePiece(x: number, y: number, player: Player, choice: string) {
        let newpiece = Game.getInstanceOfPiece(x, y, choice, player, true)
        this.board[x][y] = newpiece
        this.promotion = {x : 8, y : 8, player : 2}
    }
    buildBoard(gamei: any) {
        if (gamei) {
             let newBoard = Array(8).fill(null).map(x => Array(8).fill(null));
        for (const piece in gamei) {
            let [x, y, piec, moved, player] = gamei[piece];
            newBoard[x][y] = Game.getInstanceOfPiece(x, y, piec, player, moved);
        }
        this.board = newBoard;
        } 
    }
}
export { Game}