interface UserData {
    id :string
    accessToken: string
    username: string,
    email: string,
    stats : Stats,
    open_games: number,
    roles: Array<string>
    msg?: string
}
interface Stats {
    W: number, 
    D: number, 
    L: number,
}

interface ErrorMessage {
    msg: string
}

interface UserStats {
    stats: Stats
    open_games: number
}

interface GameAsJson {
    board: Array<Array<any | null>>
    castling: any
    color: number
    draw_proposed?: string
    id: string
    last_selected: Array<number>[]
    latest_poss: Array<number>[]
    moves: Array<any>[]
    movescount: number
    passed_pawn: any
    passed_pawn_removal: any
    promotion: {x: number, y: number, player: number}
    status: string
    turn: number
    unverified_move?: string
}

interface GameData {
    gameasjson: string
    player0id: string
    player1id: string
    status: string
    result: string
    last_change: string
    time_started: string
    time_ended: string
    draw_proposed?: string
    unverified_move?: string 
    __v: number
    _id: string
}

type MoveNotation = {
    player: string,
    piece: string,
    notation: string
}

export type {UserData, GameAsJson, GameData, UserStats, MoveNotation, ErrorMessage}