import {useState} from 'react'
import TextField from "@mui/material/TextField";

interface CreditCardProps{
  name:string;
  setName:(state:string)=>void;
}

export const CreditCardName = (props:CreditCardProps) => {
  const {name,setName} = props
    const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  // const [name, setName] = useState<string>("");
  const [color, setColor] = useState<
    "error" | "primary" | "secondary" | "info" | "success" | "warning"
  >("primary");

  const handleName = (e:any) =>{
    const value=e.target.value

    if(!value.match(/\d/)){
        setName(value)
    }
    if(value.length>=5){
      setColor("success")
      setHelperText("name valid !")
    }else{
      setColor("error")
      setHelperText("more than 5 characters")
    }
  }

  return (
    <div>
        <TextField
        error={error}
        id="card-name"
        label="Card Name"
        //defaultValue=""
        helperText={helperText}
        onChange={handleName}
        //inputRef={inputRef}
        value={name}
        color={color}
      />
    </div>
  )
}
