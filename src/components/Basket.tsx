import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import { ProductInterface, ProductToOrderInterface } from "../@types/product";
import { ImCheckmark, ImCross } from "react-icons/im";

import "./style/basket.css";
import { isProductToOrderInterface } from "../tools/typeTests";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const Basket = (): JSX.Element => {
  const { offlineCartState, getItemsFromOffLineCart, cartState } = useContext(
    CartContext
  ) as cartContextInterface;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

    const postTheNewCart = (newProdList:ProductToOrderInterface[]) =>{

      //refresh
    }

    const removeFromCartById = (id:string):void =>{
      //get the cart
      //remove
      // postTheNewCart(newProdList)
    }

    console.log("cartState", cartState);

  return (
    <div className="Basket">
      <h2>This is you basket</h2>
      <ul className="basketUl">
        {cartState &&
          cartState.map((populatedProdToOrder) => {
            const prod = populatedProdToOrder.productId;
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
                  <p>Quantity : {populatedProdToOrder.quantity}</p>
                </div>
                <div className="basketUl__li__right">
                  <p>sub</p>
                  <p>{populatedProdToOrder.quantity * prod.price}</p>
                  <p className="red" onClick={()=>removeFromCartById(prod._id)}>Supprimer</p>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
