import { GameProfile } from "./gameprofile"
import {GameData, UserData, UserStats} from '../interfaces/interfaces'

interface GameProfileProps {
  createNewGame: () => void
  loadGame: (gameid: string) => void
  retrievedGames: Array<GameData>
  setShowCurrent: () => void
  showCurrent: boolean
  userdata: UserData
  userstats: UserStats  
}

const createGameProfile = (data: GameProfileProps) => {
  let games =  data.retrievedGames.map((game: GameData) => {
   return <GameProfile key={game._id} 
                         loadGame={data.loadGame}
                         gameid={game._id} 
                         last_change={game.last_change}
                         result={game.result ? game.result : ""}
                         opponent={(game.player1id === data.userdata.id ? game.player0id : game.player1id)} 
                         status={game.status}/>})
   games.sort((a: {props: GameData}, b: {props: GameData}) => {
        return new Date(b.props.last_change).getTime() - new Date(a.props.last_change).getTime();
    });             
   return games
    
} 

const ProfilePageHolder = (data: GameProfileProps) => {   
    let {W,D,L} = JSON.parse(data.userstats.stats)
    return (
       <div className="profile">
          <div className="statistics">  
          <div className="all-statistics-num">  
            <div className="statistic--num">{W}</div><div className="statistic--word">WINS&nbsp;</div>
            <div className="statistic--num">{D}</div><div className="statistic--word">DRAWS</div>
            <div className="statistic--num">{L}</div><div className="statistic--word">LOST&nbsp;</div>
            <div className="statistic--num">{data.userstats.open_games}</div>
             <div className="statistic--word">PLAYING</div></div>

             <div className="buttons--field">
             <div className="buttons--item">
                  <button onClick={data.setShowCurrent}>
                    {data.showCurrent ? "See past games" : "See current games"}</button>
              </div>
              <div className="buttons--item">
                  <button onClick={data.createNewGame}>Open/Join New Game</button>
              </div>
             </div>
          </div>
        {data.retrievedGames && createGameProfile(data)}
       </div>)
}

export { ProfilePageHolder }