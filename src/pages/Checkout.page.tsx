import React, { Fragment, useRef, useEffect, useState, useContext } from 'react';
import TextField from '@mui/material/TextField';

export const CheckoutPage = () => {
  const inputRef = useRef<HTMLInputElement>(null!);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("")
  const [cardNumber, setCardNumber ] = useState<number | null>(null)
  

  const handleCreditCard = (e:any) =>{
    const value = e.target.value
    console.log(value)
    
    if(value) {return } 
    
    if (value.length>3){
      setError(true)
      setHelperText("invalid number")
    }else{
      setError(false)
    }
    
  }

  return (
    <>
      <div>CheckoutPage</div>
      <TextField
          error={error}
          id="outlined-error-helper-text"
          label="Card number"
          defaultValue=""
          helperText={helperText}
          onChange={handleCreditCard}
          inputRef={inputRef}
        />
    </>
  )
}
