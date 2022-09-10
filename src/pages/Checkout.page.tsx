import React, { useContext, useState, useEffect } from "react";
import CreditCard from "../components/CreditCard";
import CreditCardCvc from "../components/CreditCardCvc";
import { CartContext } from "../context/cart.context";
import Button from "@mui/material/Button";
import { CreditCardName } from "../components/CreditCardName";
import { cartContextInterface } from "../@types/cartContext.type";

import "./style/checkoutPage.css";
import { CardNumberVerification } from "card-validator/dist/card-number";
import axios from "axios";
import { DestinationAddress } from "../components/DestinationAddress";
import { DestinationAddressInterface } from "../@types/destinationAddress.type";

export const CheckoutPage = () => {
  const { getTotal, validateCartWithCreditCard } = useContext(
    CartContext
  ) as cartContextInterface;
  const [cvcNumber, setCvcNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [addressToSendState, setAddressToSendState] = useState<DestinationAddressInterface|null>(null)
  const [isCardNumberFullyValid, setIsCardNumberFullyValid] =
    useState<boolean>(false);

  const [isFullInfosValid, setIsFullInfosValid] = useState<boolean>(false);
  const [isCartValidatedByServer, setIsCartValidatedByServer] =
    useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("==============>",e)
    if (isFullInfosValid && addressToSendState) {
      console.log("==>");
      console.log(cardNumber, cvcNumber, name);
      const ans = await validateCartWithCreditCard({
        cardNumber: cardNumber.replace(/ /g, ""),
        cvcNumber,
        name,
        address:addressToSendState
      });
      if (ans) {
        setIsCartValidatedByServer(true);
      }
      console.log("validateCardWithCreditCard ans : ", ans);
    }
  };

  useEffect(()=>{
    axios.get('')
  },[])

  useEffect(() => {
    console.log(
      "conditions : ",
      isCardNumberFullyValid,
      cvcNumber.length,
      name.length
    );
    console.log("test ENSEMBLE");
    if (isCardNumberFullyValid && cvcNumber.length === 3 && name.length >= 5) {
      setIsFullInfosValid(true);
      console.log("VALIDATE !");
    } else {
      setIsFullInfosValid(false);
      console.log("NON VALID !");
    }
  }, [cvcNumber, name, cardNumber, isCardNumberFullyValid]);

  return (
    <div className="CheckoutPage">
      <h2>CheckoutPage</h2>
      {isCartValidatedByServer ? (
        <p>Thank you for your purchase ! You'll get an email confirmation !</p>
      ) : (
        <>
          <p className="total">
            Total : <span>{getTotal()}€</span>
          </p>
          <div>
            <form onSubmit={handleSubmit}>
              <CreditCard
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                setIsCardNumberFullyValid={setIsCardNumberFullyValid}
              />
              <CreditCardCvc
                cvcNumber={cvcNumber}
                setCvcNumber={setCvcNumber}
              />
              <CreditCardName name={name} setName={setName} />
              <DestinationAddress addressToSendState={addressToSendState} setAddressToSendState={setAddressToSendState}/>
              <Button
                variant="outlined"
                type="submit"
                color={isFullInfosValid ? "primary" : "error"}
              >
                Validate
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
