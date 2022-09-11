import { useState, useContext } from "react";
import { ProductInterface } from "../@types/product";
import { CartContext } from "../context/cart.context";
import { PopulatedProductToOrderInterface } from "../@types/product";
import { cartContextInterface } from "../@types/cartContext.type";

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
  const { product } = props;
  const [quantityState, setQuantityState] = useState<number>(1);
  const { addItemToOnlineCart, cartState } = useContext(
    CartContext
  ) as cartContextInterface;
    console.log('cartState : ',cartState)
  let quantityInBasket = getQuantityAlreadyInBasket(cartState, product);

  const handleQuantity = (num: number) => {
    // console.log(product, quantityInBasket);
    const maxPossibleQuantityToAdd = product.stockQuantity - quantityInBasket;
    if (num >= 0 && num <= maxPossibleQuantityToAdd) {
      setQuantityState(num);
    }
  };

  return (
    <div className="AddProductToBasket">
      {/* <label htmlFor="quantity">Quantity</label>
      <input
        value={quantityState}
        type="number"
        onChange={(el) => handleQuantity(parseInt(el.target.value))}
      /> */}
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
        addItemToOnlineCart(product._id,quantityState,product)
        setQuantityState(0)
        }}>Add</Button>

    </div>
  );
};
