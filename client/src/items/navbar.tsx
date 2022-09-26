import { Link } from "react-router-dom";

const NavBar = ({username, handleLogout} : {username: string, handleLogout: () => void}) => {
    const loggedinmenu =   <><div className="nav-item"><Link className="link" to="profile">Profile</Link></div>
                             <div className="nav-item not-link" onClick={handleLogout}>Logout</div></>
    const loggedoutmenu =  <><div className="nav-item"><Link className="link" to="login">Login</Link></div>
                             <div className="nav-item"><Link className="link" to="register">Register</Link></div></>
    const loginconf = (username !== "") ? loggedinmenu : loggedoutmenu
    return (<header className="navbar">
              <div id="title">{(username === "") ? "CHESS" : `CHESS - ${username}`}</div>
              <div className="nav-filler"></div>
                {loginconf}
            </header>) 
  }

export { NavBar }  