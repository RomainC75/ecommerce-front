import { useState, useContext } from "react";
import { ProductInterface } from "../@types/product";
import { CartContext } from "../context/cart.context";
import { PopulatedProductToOrderInterface } from "../@types/product";
import { cartContextInterface } from "../@types/cartContext.type";
import { AuthContext } from "../context/auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"

import './style/addProductToBasket.css'

interface ProductProps {
  product: ProductInterface;
}

const getQuantityAlreadyInBasket = (
  cartState: PopulatedProductToOrderInterface[],
  currentProduct: ProductInterface
) => {
  const productInBasket = cartState.find(
    (populatedProd) => populatedProd.productId._id === currentProduct._id
  );
  if (productInBasket) {
    return productInBasket.quantity;
  }
  return 0;
};

export const AddProductToBasket = (props: ProductProps): JSX.Element => {
  const { isLoggedIn } =
  useContext(AuthContext) as AuthContextInterface;

  const { product } = props;
  const [quantityState, setQuantityState] = useState<number>(1);
  const { addItemToCart, cartState } = useContext(
    CartContext
  ) as cartContextInterface;
    console.log('cartState : ',cartState)
  let quantityInBasket = getQuantityAlreadyInBasket(cartState, product);
  const [ colorState, setColorState ] = useState<"primary" | "secondary" | "success" | undefined>("primary")
  const [ buttonTextState, setButtonTextState ] = useState<"Add" | "Added" >("Add")
  const handleQuantity = (num: number) => {
    const maxPossibleQuantityToAdd = product.stockQuantity - quantityInBasket;
    if (num >= 0 && num <= maxPossibleQuantityToAdd) {
      setQuantityState(num);
    }
  };

  const handleAddingProcess = async () =>{
    const ans = await addItemToCart(product,quantityState)
    if(ans){
      setColorState('success')
      setButtonTextState('Added')
      setTimeout(()=>{
        setColorState('primary')
        setButtonTextState('Add')
      }, 2000)
    }
  }

  return (
    <div className="AddProductToBasket">
      <TextField
          className="quantityInput"
          id="standard-number"
          label="Quantity"
          type="number"
          value={quantityState}
          onChange={(el) => handleQuantity(parseInt(el.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
        />
      <Button variant="contained" onClick={()=>{
        handleAddingProcess()
        setQuantityState(0)
        }}
        color={colorState}
        >{buttonTextState}</Button>

    </div>
  );
};