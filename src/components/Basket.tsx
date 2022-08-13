import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import { ProductInterface, ProductToOrderInterface } from "../@types/product";
import { ImCheckmark, ImCross } from "react-icons/im";

import "./style/basket.css";
import { isProductToOrderInterface } from "../tools/typeTests";
import { Quantity } from "./Quantity";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const Basket = (): JSX.Element => {
  const { offlineCartState, getItemsFromOffLineCart, cartState, removeFromCartById } = useContext(
    CartContext
  ) as cartContextInterface;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  console.log("cartState", cartState);

  return (
    <div className="Basket">
      <h2>This is you basket</h2>
      <ul className="basketUl">
        {cartState &&
          cartState.map((populatedProdToOrder) => {
            const prod = populatedProdToOrder.productId;
            console.log('BEFORE in : ', prod)
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
                  <p>price : {prod.price}€</p>
                  <Quantity product={populatedProdToOrder}/>
                </div>
                <div className="basketUl__li__right">
                  <p>sub</p>
                  <p>{populatedProdToOrder.quantity * prod.price}</p>
                  <Button variant="contained" color="error" onClick={()=>removeFromCartById(prod._id)}>Remove</Button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
