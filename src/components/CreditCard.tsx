import { useState } from "react";
import TextField from "@mui/material/TextField";
import { number } from "card-validator";
import { CardNumberVerification } from "card-validator/dist/card-number";

interface CreditCardProps{
  cardNumber:string;
  setCardNumber:(state:string)=>void;
}

const splitCardNumberString = (val: string): string => {
  return val
    .split("")
    .map((n, i) => (i % 4 === 0 && i !== 0 ? " " + n : n))
    .join("")
};



const CreditCard = (props:CreditCardProps) => {
  const {cardNumber,setCardNumber} = props;
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  // const [cardNumber, setCardNumber] = useState<string>("");
  const [color, setColor] = useState<
    "error" | "primary" | "secondary" | "info" | "success" | "warning"
  >("primary");

  const handleCreditCard = (e: any) => {
    const value = e.target.value.replace(/ /g, "");
    if (value.length === 0) {
      setCardNumber("");
      return;
    }
    if (!parseInt(value) || value.length > 16) {
      console.log("impossible");
      return;
    }
    setCardNumber(splitCardNumberString(parseInt(value).toString()));
    const cardNumberValidator: CardNumberVerification = number(value);

    if (cardNumberValidator.isValid) {
      setColor("success");
      setError(false);
      setHelperText("number valid !");
    } else if (cardNumberValidator.isPotentiallyValid) {
      setColor("primary");
      setError(false);
      setHelperText("waiting...");
    } else {
      setError(true);
      setHelperText("number invalid !");
    }
  };

  return (
    <div>
      <TextField
        error={error}
        id="credit-card"
        label="Card number"
        //defaultValue=""
        helperText={helperText}
        onChange={handleCreditCard}
        //inputRef={inputRef}
        value={cardNumber}
        color={color}
      />
    </div>
  );
};

export default CreditCard;
