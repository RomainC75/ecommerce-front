import React, { useState, useContext, useEffect } from "react";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import axios from "axios";
import { ProductInterface } from "../@types/product";

import "./style/basket.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const Basket = (): JSX.Element => {
  const { offlineCartState, getItemsFromOffLineCart } = useContext(
    CartContext
  ) as cartContextInterface;

  const [basketState, setBasketState] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");


  useEffect(() => {
    const idList = getItemsFromOffLineCart()
      .map((productObj) => productObj.productId)
      .join("-");
    setIsLoading(true);
    axios
      .get(API_URL + "/product/list/" + idList)
      .then((ans) => {
        setIsLoaded(true);
        setIsLoading(false);
        setBasketState(ans.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage(err.response.data);
      });
  }, []);

  const isInStock = (product:ProductInterface, desiredQuantity:number):boolean =>{
    return product.stockQuantity >= desiredQuantity ? true : false 
  }

  return (
    <div className="Basket">
      <ul className="basketUl">
        {isLoaded &&
          basketState.map((product) => (
            <li key={product._id}>
              {"pictures" in product && Array.isArray(product.pictures) ? (
                <img src={product.pictures[0]} alt={"image" + product.name} />
              ) : (
                <img src="" alt="blank" />
              )}
              <div>
                <p>{product.brand}</p>
                <p>{product.name}</p>
                
              </div>
              
            </li>
          ))}
      </ul>
    </div>
  );
};
