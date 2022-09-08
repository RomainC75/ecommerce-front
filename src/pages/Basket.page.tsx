import React, { useState, useContext } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import { PopulatedProductToOrderInterface, ProductInterface, ProductToOrderInterface } from "../@types/product";
import { ImCheckmark, ImCross } from "react-icons/im";

import "./style/basket.css";
import { isProductToOrderInterface } from "../tools/typeTests";
import { Quantity } from "../components/Quantity";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const getNewPromoPrice = (basePrice:number, promo:number):number =>{  
  return basePrice - basePrice*promo/100
}

const getTotal = (cart:PopulatedProductToOrderInterface[]):string =>{
  return cart.reduce((accu:number,currentProd:PopulatedProductToOrderInterface)=>{
    if("promo" in currentProd.productId && currentProd.productId.promo){
      return accu+ getNewPromoPrice(currentProd.productId.price,currentProd.productId.promo)*currentProd.quantity
    }else{
      return accu+ currentProd.productId.price*currentProd.quantity
    }
  },0).toFixed(2)
}

export const BasketPage = (): JSX.Element => {
  const {
    offlineCartState,
    getItemsFromOffLineCart,
    cartState,
    removeFromCartById,
  } = useContext(CartContext) as cartContextInterface;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  console.log("cartState", cartState);
  
  const goToCheckout = () =>{
    console.log('CHEKCOUT')
    localStorage.setItem('isCurrentCartValidated','true')
    navigate("/checkout")
  }

  return (
    <div className="Basket">
      <h2>This is you basket</h2>
      <h3>Total : {getTotal(cartState)} €</h3>
      <Button variant="contained" onClick={goToCheckout}>Checkout !</Button>
      <ul className="basketUl">
        {cartState &&
          cartState.map((populatedProdToOrder) => {
            const prod = populatedProdToOrder.productId;
            console.log("BEFORE in : ", prod);
            const pic =
              "pictures" in prod && Array.isArray(prod.pictures)
                ? prod.pictures[0]
                : "https://i.stack.imgur.com/mwFzF.png";
            return (
              <li key={prod._id} className="basketUl__li">
                <div className="basketUl__li__img">
                  <img src={pic} alt={`picture of ${prod._id}`} />
                </div>
                <div className="basketUl__li__middle">
                  <h3>{prod.name}</h3>
                  <p>by {prod.brand}</p>
                  <p>
                    in stock :{" "}
                    {prod.stockQuantity > 0 ? (
                      <ImCheckmark className="green" />
                    ) : (
                      <ImCross className="red" />
                    )}
                  </p>

                  <p>
                    price :{" "}
                    {"promo" in prod && prod.promo ? (
                      <span style={{ color: "red", fontWeight:600 }}>
                        {getNewPromoPrice(prod.price,prod.promo).toFixed(2)}
                      </span>
                    ) : (
                      prod.price
                    )}
                    €
                  </p>

                  <Quantity product={populatedProdToOrder} />
                </div>
                <div className="basketUl__li__right">
                  <p>sub</p>
                  <p>{"promo" in prod && prod.promo ? 
                    (populatedProdToOrder.quantity*getNewPromoPrice(prod.price,prod.promo)).toFixed(2)
                    :
                    (populatedProdToOrder.quantity * prod.price ).toFixed(2)
                  }</p>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeFromCartById(prod._id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
