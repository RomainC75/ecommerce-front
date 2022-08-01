import axios from 'axios'
import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../context/auth.context'
import { AuthContextInterface } from '../@types/authContext.type'
import { Link } from 'react-router-dom'

import './style/navbar.css'

const Navbar = ():JSX.Element => {

  const { storeToken, authenticateUser, isLoggedIn, user, logOutUser } = useContext(AuthContext) as AuthContextInterface;
  
  useEffect(()=>{
    authenticateUser()
  },[])

  return (
    <div className="Navbar">
      <div className="logo">LOGO</div>
      <h1>ECOMMERCE</h1>
        {isLoggedIn ? 
          <div className="Navbar__logPart">
            <p>hello : {user && user.email} !  </p>
            <p onClick={logOutUser}>LogOut</p>
          </div>
        :
          <div>
            <Link to="/login">Login</Link>  
          </div>}
    </div>
  )
}

export default Navbar