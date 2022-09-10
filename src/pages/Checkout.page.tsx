import React,{useContext, useState} from "react";
import CreditCard from "../components/CreditCard";
import CreditCardCvc from "../components/CreditCardCvc";
import { CartContext } from "../context/cart.context";
import Button from "@mui/material/Button";
import { CreditCardName } from "../components/CreditCardName";
import { cartContextInterface } from "../@types/cartContext.type";

import './style/checkoutPage.css'

export const CheckoutPage = () => {

  const {
    getTotal
  } = useContext(CartContext) as cartContextInterface;
  const [cvcNumber, setCvcNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
    console.log(e.target)
  };

  

  return (
    <div className="CheckoutPage">
      <h2>CheckoutPage</h2>
      <p className="total">Total : <span>{getTotal()}€</span></p>
      <div>
        <form onSubmit={handleSubmit}>
          <CreditCard cardNumber={cardNumber} setCardNumber={setCardNumber}/>
          <CreditCardCvc cvcNumber={cvcNumber} setCvcNumber={setCvcNumber}/>
          <CreditCardName name={name} setName={setName}/>
          <Button variant="outlined" type="submit">
            Validate
          </Button>
        </form>
      </div>
    </div>
  );
};
