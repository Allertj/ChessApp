import React from 'react'
import { makePOSTRequest } from '../misc/requests'
import { server } from '../config'
import { useNavigate } from "react-router-dom";
import { UserData } from '../interfaces/interfaces'

const LoginScreen = ({login}: {login: (data: UserData) =>void}) => {
  let [messages, updateMessage] = React.useState("")
  const [formData, setFormData] = React.useState({ username: "", password: "", })
  let navigate = useNavigate();

  const handleRequest = (receivedData: UserData | undefined) => { 
    if (!receivedData) {
      updateMessage("Server has not responded.")      
    } else if (receivedData.message) {
      updateMessage(receivedData.message)
    } else {
      login(receivedData)
      navigate("/profile", { replace: true });
    }
  }
  
  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
    makePOSTRequest(`${server}/api/auth/signin`, formData, handleRequest, "")  
  }
  
  const setData = (data: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => {
      return {  ...prevState,
                [data.target.name] : data.target.value } 
    })
  }

  return (<div className='login'>
            <form onSubmit={submitForm}>
              <div className='center-form'><label>Username</label></div>
              <div><input type="text" name="username" onChange={setData} value={formData.username}/></div>
              <div className='center-form'><label>Password</label></div>
              <div><input type="text" name="password" onChange={setData} value={formData.password}/></div>
              <div>{messages}</div>
              <div className='center-form'><button type="submit">Login</button></div>
            </form>
          </div>)
}

export { LoginScreen }