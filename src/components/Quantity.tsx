import React, { useState,useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { PopulatedProductToOrderInterface } from "../@types/product";
import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";

import "./style/quantity.css";

interface quantityProps {
  product: PopulatedProductToOrderInterface;
}

export const Quantity = (props: quantityProps): JSX.Element => {
  const { product } = props;
  const { updateCart } = useContext(CartContext) as cartContextInterface;
  const [quantityState, setQuantityState] = useState<number>(product.quantity);
  const [updateButtonColorState, setUpdateButtonColorState] = useState<'primary'|'error'|'success'>('primary')

  const handleQuantity = (
    el: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newQuantity=parseInt(el.target.value)
    if(newQuantity<=product.productId.stockQuantity){
        setQuantityState(parseInt(el.target.value));
    }
  };

  const updateQuantity = async() => {
    const res= await updateCart(product.productId._id,quantityState)
    if(res){
        setUpdateButtonColorState('success')
    }else{
        setUpdateButtonColorState('error')
    }
  };

  return (
    <div className="Quantity">
      <TextField
        id="outlined-number"
        label="Quantity"
        type="number"
        onChange={handleQuantity}
        value={quantityState}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button color={updateButtonColorState} variant="contained" onClick={() => updateQuantity()}>
        update
      </Button>
    </div>
  );
};
