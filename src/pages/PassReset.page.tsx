import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const PassResetPage = () => {
    const{resetToken}=useParams()
    const navigate=useNavigate()
  const [colorState, setColorState] = useState<"error" | "primary" | "success">(
    "primary"
  );
  const [pass1State, setPass1State] = useState<string>("");
  const [pass2State, setPass2State] = useState<string>("");
  const [isPasswordValidatedState, setIsPasswordValidatedState] =
    useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isRequestAccepted, setIsRequestAccepted] = useState<boolean>(false)
  const [responseMessage, setResponseMessage] = useState<string>('')

  useEffect(() => {
    localStorage.removeItem("authToken");
  }, []);

  useEffect(() => {
    console.log(pass1State, pass2State);
    handlePass1and2(pass1State, pass2State);
  }, [pass1State, pass2State]);

  const handlePass1and2 = (pass1: string, pass2: string) => {
    if (pass1.length === 0 && pass2.length === 0) {
      setColorState("primary");
      setIsPasswordValidatedState(false);
    } else if (pass1 === pass2) {
      setColorState("success");
      setIsPasswordValidatedState(true);
    } else {
      setColorState("error");
      setIsPasswordValidatedState(false);
    }
  };

  const postNewPassword = async() =>{
    try {
        const data={
            token:resetToken,
            password:pass1State
        }
        const ans = await axios.post(`${API_URL}/auth/resetpasswordwithtoken`, data)
        console.log("answer : ", ans.data)
        setIsRequestAccepted(true)
        setResponseMessage(ans.data.message)
        setIsError(false)
        setTimeout(()=>{
            navigate('/login')
        },2000)
    } catch (error:any) {
        console.log(error.response.data.message)
        setErrorMessage(error.response.data.message)
        setIsRequestAccepted(false)
    }
  }

  return (
    <div className="PassResetPage">
      <h2>Enter your new Password</h2>
      <div>
        <TextField
          id="outlined-password-input"
          label="password"
          type="password"
          color={colorState}
          onChange={(el) => setPass1State(el.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="password"
          type="password"
          color={colorState}
          onChange={(el) => setPass2State(el.target.value)}
        />
      </div>
      <Button variant="contained" disabled={!isPasswordValidatedState} onClick={postNewPassword}>
        Reset Password
      </Button>
      {isError && <p className="error">{errorMessage}</p>}
      {isRequestAccepted && <p className="validated">{responseMessage}</p>}
      {isRequestAccepted && <p className="validated"> wait, you will be redirected !</p>}
    </div>
  );
};
