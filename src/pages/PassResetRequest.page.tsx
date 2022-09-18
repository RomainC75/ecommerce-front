import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const PassResetRequestPage = () => {
  const [emailState, setEmailState] = useState<string>('')
  const [isEmailValidState, setIsEmailValidState] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isRequestAccepted, setIsRequestAccepted] = useState<boolean>(false)
  const [responseMessage, setResponseMessage] = useState<string>('')

  const validateEmail = (email:string):void =>{
    console.log('simple regex : ',email.match(/^.{3,}@\w{2,}\.\w{2,}$/))
    if(email.match(/^.{3,}@\w{2,}\.\w{2,}$/)){
      setIsEmailValidState(true)
    }else{
      setIsEmailValidState(false)
    }
    setEmailState(email)
  }

  const handleEmail = async()=>{
    try {
      const data = {
        email:emailState
      }
      const ans = await axios.post(`${API_URL}/auth/getresettoken`, data);
      console.log(ans)
      setIsRequestAccepted(true)
      setResponseMessage(ans.data.message)
      setIsError(false)
    } catch (error:any) {
      setIsError(true)
        console.log(error.response.data.message)
        setErrorMessage(error.response.data.message)
        setIsRequestAccepted(false)
    }
  }

  return (
    <div className="PassResetRequestPage">
      <p>please enter your email address</p>
      <div>
        <TextField
            id="outlined-required"
            label="email"
            value={emailState}
            onChange={(el)=>validateEmail(el.target.value)}
          />
      </div>
      <Button variant="contained" onClick={handleEmail} disabled={!isEmailValidState}>SendEmail</Button>
      {isError && <p className="error">{errorMessage}</p>}
      {isRequestAccepted && <p className="validated">{responseMessage}</p>}
    </div>
  )
}
