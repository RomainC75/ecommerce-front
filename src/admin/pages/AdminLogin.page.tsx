import React, { useContext, useState } from "react";
import axios from "axios";
import { AdminAuthContext } from "../../context/adminAuth.context";
import { Link, useNavigate } from "react-router-dom";
import { AdminAuthContextInterface } from "../../@types/adminAuthContext.type";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import './style/adminLoginPage.css'
import image from '../../images/login-image.jpg'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const AdminLoginPage = (): JSX.Element => {
  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { storeToken, authenticateAdmin } = useContext(
    AdminAuthContext
  ) as AdminAuthContextInterface;
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(emailState, passwordState);
    axios
      .post(API_URL + "/auth/signin", {
        email: emailState,
        password: passwordState,
      },{
        headers:{
          isadmin:"true"
        }
      })
      .then((ans) => {
        console.log("ans : ", ans.data);
        storeToken(ans.data.token);
        authenticateAdmin();
        navigate("/admin");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div className="AdminLoginPage">
      <h2> Please enter your login and password :</h2>
      <img src={image} alt="login-image"/>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <TextField
            id="email"
            className="inputs__input"
            name="email"
            label="email"
            required
            onChange={(e) => setEmailState(e.target.value)}
            variant="filled"
          />
          <TextField
            id="password"
            className="inputs__input"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            onChange={(e) => setPasswordState(e.target.value)}
            required
          />
        </div>
        <Button variant="contained" type="submit">
          Login !
        </Button>
        
      </form>
      <div className="forgot"><Link to='/resetpass'>forgot your password ?</Link></div>
      <p className="error">{errorMessage}</p>

      <p>new administrator ? signup <Link to='/admin/signup' className="link">here</Link></p>
    </div>
  );
};
