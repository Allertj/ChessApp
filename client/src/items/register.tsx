import React from 'react'
import {makePOSTRequest} from '../misc/requests'
import { server } from '../config'

type RegisterForm = {username:string, password:string, email:string}

const Register = () => {
    const [formData, setFormData] = React.useState<RegisterForm>({  username: "", password: "" ,email: "" })
    const [message, setMessage] = React.useState("")
      const setData = (data: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => {
          return {  ...prevState,
                    [data.target.name] : data.target.value } 
        })
}
    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()
        makePOSTRequest(`${server}/api/auth/signup`, formData, setMessage, "message")

      }
    return (<div className='login'>
            <form onSubmit={submitForm}>
                <div className='center-form'><label>Email</label></div>
                <div><input type="text" name="email" onChange={setData} value={formData.email}/></div>
                {/* <div>{message}</div> */}
                <div className='center-form'><label>Username</label></div>
                <div><input type="text" name="username" onChange={setData} value={formData.username}/></div>
                {/* <div>{data.messages.usernamemsg}</div> */}
                <div className='center-form'><label>Password</label></div>
                <div><input type="text" name="password" onChange={setData} value={formData.password}/></div>
                <div>{message}</div>
                <div className='center-form'><button type="submit">Register</button></div>
            </form>
            </div>)

}
export { Register } 