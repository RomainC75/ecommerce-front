import React, { useState, useContext } from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import { ImCheckmark, ImCross } from "react-icons/im";

import "./style/basket.css";
import { Quantity } from "../components/Quantity";
import Button from "@mui/material/Button";


export const BasketPage = (): JSX.Element => {
  const {
    cartState,
    removeFromCartById,
    getTotal,
    getNewPromoPrice
  } = useContext(CartContext) as cartContextInterface;

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
      <h3>Total : {getTotal()} €</h3>
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
                  <Link to={`/product/${populatedProdToOrder.productId._id}`}><img src={pic} alt={`picture of ${prod._id}`} /></Link>
                </div>
                <div className="basketUl__li__middle">
                  <h3>{prod.name}</h3>
                  <p><span className="infoName">By {prod.brand}</span></p>
                  <p>
                  <span className="infoName">In Stock</span> :{" "}
                    {prod.stockQuantity > 0 ? (
                      <ImCheckmark className="green" />
                    ) : (
                      <ImCross className="red" />
                    )}
                  </p>
                  <p>
                  <span className="infoName">Price</span> :{" "}
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
                  <p><span className="infoName">Sub</span> :</p>
                  <p>{"promo" in prod && prod.promo ? 
                    (populatedProdToOrder.quantity*getNewPromoPrice(prod.price,prod.promo)).toFixed(2)
                    :
                    (populatedProdToOrder.quantity * prod.price ).toFixed(2)
                  }</p>
                  <Button
                    className="removeButton"
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
