import React, { useEffect, useState } from "react";

import "./style/adminSignupPage.css";

import image from "../../images/signup-image.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const AdminSignupPage = (): JSX.Element => {
  const [emailState, setEmailState] = useState<string>("");
  const [password1State, setPassword1State] = useState<string>("");
  const [password2State, setPassword2State] = useState<string>("");
  const [passwordsColorState, setPasswordsColorState] = useState<'primary'|'error'|'success'>('primary')
  const [isPasswordValidatedState, setIsPasswordValidatedState]=useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(emailState, password1State);
    axios
      .post(API_URL + "/admin/auth/signup", {
        email: emailState,
        password: password1State,
      })
      .then((ans) => {
        console.log("ans : ", ans.data);
        navigate("/admin/login");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  useEffect(() => {
    if(password1State.length===0 && password2State.length===0){
      setPasswordsColorState('primary')
      setIsPasswordValidatedState(false)
    }else if(password1State===password2State){
      setPasswordsColorState('success')
      setIsPasswordValidatedState(true)
    }else{
      setPasswordsColorState('error')
      setIsPasswordValidatedState(false)
    }
  }, [password1State,password2State])
  

  return (
    <div className="AdminSignupPage">
      <h2>Signup Page</h2>
      <img className="img" src={image} />
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div>
            <TextField
              id="email"
              className="inputs__input"
              name="email"
              label="email"
              required
              onChange={(e) => setEmailState(e.target.value)}
              variant="filled"
            />
          </div>
          <div className="passwords">
            <TextField
              id="password"
              className="inputs__input"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
              onChange={(e) => setPassword1State(e.target.value)}
              color={passwordsColorState}
              required
            />
            <TextField
              id="password"
              className="inputs__input"
              name="password"
              label="Email confirmation"
              type="password"
              autoComplete="current-password"
              variant="filled"
              onChange={(e) => setPassword2State(e.target.value)}
              color={passwordsColorState}
              required
            />
          </div>
        </div>
        <Button variant="contained" type="submit" disabled={!isPasswordValidatedState}>
          Login !
        </Button>
      </form>
      <p className="error">{errorMessage}</p>
    </div>
  );
};
