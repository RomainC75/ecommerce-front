import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { AuthContextInterface } from "../@types/authContext";

const base_url = "http://localhost:5005";

export const LoginPage = (): JSX.Element => {
  const [emailState, setEmailState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>('')

  const { storeToken, authenticateUser } = useContext(AuthContext) as AuthContextInterface;
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(emailState, passwordState);
    axios
      .post(base_url + "/auth/signin", {
        email: emailState,
        password: passwordState,
      })
      .then((ans) => {
        console.log("ans : ", ans.data);
        storeToken(ans.data.token)
        authenticateUser()
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message)
      });
  };

  return (
    <div className="LoginPage">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={emailState}
          onChange={(e) => setEmailState(e.target.value)}
        ></input>
        <label htmlFor="email">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={passwordState}
          onChange={(e) => setPasswordState(e.target.value)}
        ></input>
        <button type="submit">logIn !</button>
      </form>
      <p>{errorMessage}</p>
    </div>
  );
};
