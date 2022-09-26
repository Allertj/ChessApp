import { MoveNotation } from '../interfaces/interfaces'

type SideBarArgs = {
  concede: () => void
  proposeDraw: () => void
  setStatus: (data: string) => void
  moves: Array<MoveNotation>
  status: string
}

const SideBar = (data: SideBarArgs) => {
    let white = data.moves.filter((move : MoveNotation) => move.player === "WHITE")
           .map((moves: MoveNotation, index: number) => 
                 <div key={moves.notation+index}>{moves.piece !== "P" && moves.piece} {moves.notation}</div>)
    let black = data.moves.filter((move: MoveNotation) => move.player === "BLACK")
           .map((moves: MoveNotation, index: number) => 
                 <div key={moves.notation+index}>{moves.piece !== "P" && moves.piece} {moves.notation}</div>)
    const concede = () => {
        data.setStatus("You have conceded")
        data.concede()
    }
    let conditions = ["Playing", "Promotion", "Check"]
    let concedestring = conditions.includes(data.status) ? "CONCEDE" : ""
    let proposedrawstring = conditions.includes(data.status) ? "PROPOSE DRAW" : ""
    return (
      <div className="sidebar flex-child">
        <div className='flex-container'>
        <div className='column sidebar-option' onClick={concede}>{concedestring}</div> 
        <div className='column sidebar-option' onClick={data.proposeDraw}>{proposedrawstring}</div>          
        </div>
        <div className="moves">STATUS:</div>
          <div id="caller">{data.status}</div>
            <div className="moves">MOVES:</div>
              <div className='some-page-wrapper'>
                <div className='row'>
                  <div className='column'>
                    <div className='blue-column'>
                      <div className='moves-title'>BLACK</div>
                      {white}
                    </div>
                  </div>
                  <div className='column'>
                    <div className='green-column'>
                      <div className='moves-title'>WHITE</div>
                      {black}
                  </div>
                </div>
              </div>
           </div>
      </div>
    )
  }

  export { SideBar }