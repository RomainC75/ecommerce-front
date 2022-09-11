import {useState} from "react";
import TextField from "@mui/material/TextField";

interface CreditCardCvcProp{
  cvcNumber:string
  setCvcNumber:(state:string)=>void
}

const CreditCardCvc = (props:CreditCardCvcProp) => {
  const {cvcNumber,setCvcNumber}=props
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [color, setColor] = useState<
    "error" | "primary" | "secondary" | "info" | "success" | "warning"
  >("primary");

  const handleCvc = (e:any) =>{
    const value=e.target.value
    console.log(value)

    if(value.length<=3 && !value.match(/\D/)){
        setCvcNumber(value)
    }
    if(value.length===3){
        setColor("success")
    }
  }

  return (
    <div>
      <TextField
        error={error}
        id="card-cvc"
        label="Cvc"
        //defaultValue=""
        helperText={helperText}
        onChange={handleCvc}
        //inputRef={inputRef}
        value={cvcNumber}
        color={color}
      />
    </div>
  );
};

export default CreditCardCvc;
