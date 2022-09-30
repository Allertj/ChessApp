import React from 'react';
import { ProfilePage } from './profile/profilepage';
import { LoginScreen } from './items/login'
import { MainContainer } from './gameplay/maincontainer'
import { NavBar } from './items/navbar'
import { Register} from './items/register'
import { Routes, Route, useNavigate } from "react-router-dom";
import {UserData, GameAsJson} from './interfaces/interfaces'

const StandardScreen = ({userdata, chooseGame, saveUserData, handleLogout}: 
                        {userdata: UserData | undefined, 
                         chooseGame: (data: GameAsJson) => void, 
                         saveUserData: (data: UserData) => void,
                         handleLogout: () => void}) => {
      if (userdata) { 
      return <ProfilePage userdata={userdata} 
                          handlechoice={chooseGame}
                          handleLogout={handleLogout}/>
    } else { 
      return <LoginScreen login={saveUserData}/>
    }
}

const Page = () => {
  let navigate = useNavigate();
  let [gameasjson, setGameAsJson] = React.useState<GameAsJson>()
  let [userdata, setUserData] = React.useState<UserData>() 
  const saveUserData = (data : UserData) => {
      localStorage.setItem("userdata", JSON.stringify(data))
      setUserData(data)
      navigate("/profile", { replace: true });
  }

  const chooseGame = (gameasjson: GameAsJson) => {
      setGameAsJson(gameasjson)
  }

  React.useEffect(() => {
    let results = localStorage.getItem("userdata")   
    if (results !== null) {
        setUserData(JSON.parse(results))
    }
  }, [])

  const handleLogout = () => {
      console.log("HANDLELOGOUT TRIGGERED")
      localStorage.removeItem("userdata")
      setUserData(undefined)
      navigate("/login", { replace: true });
  }
  let standard = < StandardScreen userdata={userdata} 
                                  handleLogout={handleLogout} 
                                  saveUserData={saveUserData} 
                                  chooseGame={chooseGame}/>
                          
  return (<div className="main-container">
            
            <NavBar handleLogout={handleLogout}  
                    username={userdata ? userdata.username : ""}/> 
            <Routes>
                <Route path="/" 
                       element={standard} />
                <Route path="/login" 
                       element={standard} />       
                <Route path="/register" 
                       element={<Register/>} />     
                <Route path="/profile" 
                       element={standard}/>             
                <Route path="/game" 
                       element={ gameasjson && userdata ? 
                                 <MainContainer gamedata={gameasjson} 
                                                userdata={userdata}/> : standard}/> 
                <Route path="*" element={standard}/>                                 
            </Routes>                                                     
         </div>)      
}

export { Page } 
