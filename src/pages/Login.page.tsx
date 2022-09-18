import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { Link, useNavigate } from "react-router-dom";
import { AuthContextInterface } from "../@types/authContext.type";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import './style/loginPage.css'
import image from '../images/login-image.jpg'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const LoginPage = (): JSX.Element => {
  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { storeToken, authenticateUser } = useContext(
    AuthContext
  ) as AuthContextInterface;
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(emailState, passwordState);
    axios
      .post(API_URL + "/auth/signin", {
        email: emailState,
        password: passwordState,
      })
      .then((ans) => {
        console.log("ans : ", ans.data);
        storeToken(ans.data.token);
        authenticateUser();
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div className="LoginPage">
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
        <div><Link to='/resetpass'>forgot your password ?</Link></div>
        <Button variant="contained" type="submit">
          Login !
        </Button>
        
      </form>
      <p className="error">{errorMessage}</p>
    </div>
  );
};
