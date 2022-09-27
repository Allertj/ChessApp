import { render, screen } from '@testing-library/react';
import { NavBar } from '../items/navbar'
import { LoginScreen } from '../items/login'
import { Register } from '../items/register'
import { ProfilePageHolder } from '../profile/profilepageholder';
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

test('react tests - Navbar - Logged out', () => {
  render(<Router><NavBar username="" handleLogout={()=>{}}/></Router>);
  expect(screen.getByText('CHESS')).toBeInTheDocument()
  expect(screen.getByText('Login')).toBeInTheDocument()
  expect(screen.getByText('Register')).toBeInTheDocument()
  expect(screen.getByText("Login").className).toBe("link")
  expect(screen.getByText("Register").className).toBe("link")
});

test('react tests - Navbar - Logged in', () => {
  render(<Router><NavBar username="UserName" handleLogout={()=>{}}/></Router>);
  const divElement =  <div className="nav-filler"></div>
  expect(screen.getByText('CHESS - UserName')).toBeInTheDocument()
  expect(screen.getByText('Profile')).toBeInTheDocument()
  expect(screen.getByText('Logout')).toBeInTheDocument()
  expect(screen.getByText("Profile").className).toBe("link")  
});

test('react tests - Login - Logged in', () => {
  render(<Router><LoginScreen login={()=>{}}/></Router>);
  expect(screen.getByText('Username')).toBeInTheDocument()
  expect(screen.getByText('Password')).toBeInTheDocument()
  expect(screen.getByText('Login')).toBeInTheDocument()
  expect(screen.getByRole('button')).toHaveTextContent("Login")
  expect(screen.getByRole('button')).toBeInTheDocument()
});

test('react tests - Register', () => {
  render(<Router><Register /></Router>);
  expect(screen.getByText('Username')).toBeInTheDocument()
  expect(screen.getByText('Password')).toBeInTheDocument()
  expect(screen.getByText('Email')).toBeInTheDocument()
  expect(screen.getByRole('button')).toHaveTextContent("Register")
  expect(screen.getByRole('button')).toBeInTheDocument()
});

let UserData = {  id : "someid",
                  accessToken: "token",
                  username: "username",
                  email: "email",
                  stats : {W: 5, D: 6, L:8},
                  open_games: 10,
                  roles: ["USER"] }

let gameData =  { gameasjson: "{}",
                  player0id: "player0idtest",
                  player1id: "player1idtest",
                  status: "Test status",
                  result: "Test result",
                  last_change: "Test date",
                  time_started: "Test date 2",
                  time_ended: "Test date 3",
                  draw_proposed: "false",
                  __v: 10,
                  _id: "Test gameid",
                }                  

test('react tests - Profile', () => {
  render(<Router><ProfilePageHolder 
         createNewGame={()=>{}} 
         loadGame={()=>{}} 
         userdata={UserData}
         retrievedGames={[gameData]}
         userstats={{stats: {"W":1,"D":0,"L":0}, open_games:4}}
         setShowCurrent={()=>{}} 
         showCurrent={false}/></Router>);
  expect(screen.getByText('WINS')).toBeInTheDocument()
  expect(screen.getByText('DRAWS')).toBeInTheDocument()
  expect(screen.getByText('LOST')).toBeInTheDocument()
  expect(screen.getByText('See current games')).toBeInTheDocument()
  expect(screen.getByText('Open/Join New Game')).toBeInTheDocument()
  // const button = shallow((<Button onClick={mockCallBack}>Ok!</Button>));
  // screen.getByText('Open/Join New Game')
    // expect(screen.getByRole('button'))
    // screen.get
    // document.
    // console.log(screen.getAllByRole('button'))
      // expect(screen.getByRole('button')).toHaveTextContent("Register")
});