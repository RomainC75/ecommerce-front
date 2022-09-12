import React, { useState } from "react";

import "./style/signupPage.css";

import image from "../images/signup-image.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";


export const SignupPage = (): JSX.Element => {
  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(emailState, passwordState);
    axios
      .post(API_URL + "/auth/signup", {
        email: emailState,
        password: passwordState,
      })
      .then((ans) => {
        console.log("ans : ", ans.data);
        navigate("/login");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div className="SignupPage">
      <h2>Signup Page</h2>
      <img className="img" src={image} />
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
      <p>{errorMessage}</p>
    </div>
  );
};
