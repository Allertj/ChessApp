import React from 'react';
import { useNavigate } from "react-router-dom";
import { makePOSTRequestAuth, makeGETRequestAuth } from '../misc/requests'
import { server } from '../config'
import { reviver} from '../misc/helper'
import {ProfilePageHolder} from './profilepageholder'
import {UserData, GameAsJson, GameData, UserStats, ErrorMessage} from '../interfaces/interfaces'

const ProfilePage = (props: {handlechoice: (data:GameAsJson) => void, 
                             userdata: UserData,
                             handleLogout: () => void}) => {
                                
  let navigate = useNavigate();
  let [retrieveGames, setRetrieveGames] = React.useState<GameData[]>([])
  let [userstats, setUserStatsState] = React.useState({stats: {W:0, D:0, L:0}, open_games: 0,})
  let [showCurrentGames, setShowCurrentState] = React.useState(true)

  const setShow = () => {
    setShowCurrentState(showCurrentGames => !showCurrentGames)
  }
  React.useEffect(() => {   
        askNewGames()
        askUserStats()
  }, [])
    React.useEffect(() => {    
        const interval = setInterval(() => {
                if (showCurrentGames) {
                    askNewGames()
                }
                askUserStats()
        }, 5000)
        return () => clearInterval(interval)
    }, [showCurrentGames])

  const askUserStats = () => {
    makeGETRequestAuth(`${server}/profile/${props.userdata.id}/stats`, 
                        setUserStats, 
                        "", 
                        props.userdata.accessToken, 
                        props.handleLogout)
  }
  const setUserStats = (data: UserStats) => {
      setUserStatsState(data)
  }
  const setShowCurrent = () => {
      setShow()  
      if (!showCurrentGames) {
         askNewGames()
      } else {
          makeGETRequestAuth(`${server}/profile/${props.userdata.id}/closed`, 
                              getOldGames, 
                              "", 
                              props.userdata.accessToken,
                              props.handleLogout)
      }
  }               

  const askNewGames = () => {
      makeGETRequestAuth(`${server}/profile/${props.userdata.id}/open`, 
                          getNewGames, 
                          "", 
                          props.userdata.accessToken, 
                          props.handleLogout)
      askUserStats()  
    }
  const createNewGame = () => {
      makePOSTRequestAuth(`${server}/profile/${props.userdata.id}/start`, 
                            props.userdata, 
                            askNewGames, 
                            "", 
                            props.userdata.accessToken,
                            props.handleLogout)
                    
  }
  const getNewGames = (data: { "games" : GameData[]}) => {
      setRetrieveGames(data.games)
  }
  const getOldGames = (data: { "games" : GameData[]}) => {
      setRetrieveGames(data.games) 
  }
  const loadGame = (gameid: string) => {
      makeGETRequestAuth(`${server}/profile/${props.userdata.id}/open/${gameid}`, 
                          loadedGameRetrieved, 
                          "", 
                          props.userdata.accessToken, 
                          props.handleLogout) 
  }
  const loadedGameRetrieved = (data: GameData) => {
      let color = (data.player1id == props.userdata.id ? 1 : 0)
      let gamedata = JSON.parse(data.gameasjson, reviver)       
      gamedata.color = color
      gamedata.id = data._id
      gamedata.unverified_move = data.unverified_move
      gamedata.draw_proposed = data.draw_proposed
      props.handlechoice(gamedata)
      navigate("/game", { replace: true });
  } 

  return <ProfilePageHolder userdata={props.userdata}
                            userstats={userstats}
                            showCurrent={showCurrentGames}
                            loadGame={loadGame}
                            createNewGame={createNewGame}
                            setShowCurrent={setShowCurrent}
                            retrievedGames={retrieveGames}/>
  }  

  export { ProfilePage }