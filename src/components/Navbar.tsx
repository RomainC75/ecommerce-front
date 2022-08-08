import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";

import { FaShoppingCart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

import "./style/navbar.css";

const Navbar = (): JSX.Element => {
  const { storeToken, authenticateUser, isLoggedIn, user, logOutUser } =
    useContext(AuthContext) as AuthContextInterface;
  const { offlineCartState, getItemsFromOffLineCart, cartState } = useContext(
    CartContext
  ) as cartContextInterface;
  const [itemsNumberState, setItemsNumberState] = useState<number>(0);
  const navigate = useNavigate();

  const goToTheBasket = () => {
    if (itemsNumberState > 0) {
      navigate("/basket");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      const itemsNumber = Object.keys(cartState);
      setItemsNumberState(itemsNumber.length);
    }
  }, [isLoggedIn, cartState]);

  return (
    <div className="Navbar">
      <div className="logo">LOGO</div>
      <Link to="/">
        <h1>ECOMMERCE</h1>
      </Link>
      {isLoggedIn ? (
        <div className="Navbar__logPart">
          <p>hello : {user && user.email} ! </p>
          <p onClick={logOutUser} className="logOut">LogOut</p>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
        </div>
      )}

      <div className="Navbar__shopping" onClick={() => goToTheBasket()}>
        {itemsNumberState > 0 ? (
          <>
            <FaShoppingCart className="basketIcon" />
            <div className="Navbar__shopping__number">{itemsNumberState}</div>
          </>
        ) : (
          <FiShoppingCart className="basketIcon" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
