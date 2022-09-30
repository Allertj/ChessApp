interface GameProfileArgs {gameid: string, 
                           status: string, 
                           result: string,
                           last_change: string,
                           opponent: string, 
                           loadGame: (data: string) => void}

const parseResult = (res: any, opponent: number) => {
    if (res.draw === "true") return "Draw"
    if (res.loser !== null) {return res.loser !== opponent ? `Lost by ${res.by}` : `Won by ${res.by}`}
    if (res.winner !== null) {return res.winner!== opponent ? `Won by ${res.by}` : `Lost by ${res.by}`}   
}

const getStatus = (status: string, callback: () => void) => {
    switch (status) {
        case "Open": return <div></div>
        case "Ended": return <button onClick={callback}>View</button>
        default: return <button onClick={callback}>Resume</button>
    }
}
const GameProfile = ({ gameid, status, opponent, result, loadGame }: GameProfileArgs) => {
    const chooseGame = () => {
        loadGame(gameid)
    } 
    return (<div className="game">
              <div className="stat">GAME {gameid.slice(-10)}</div>
              <div className="stat">Played Against : {opponent.slice(-10)}</div>
              <div className="stat">Status : {status}</div>
              {status === "Ended" && <div className="stat"> {parseResult(result, parseInt(opponent))}</div>}
              <div className="button">{getStatus(status, chooseGame)}</div>
            </div>)
  }
  
export { GameProfile }
