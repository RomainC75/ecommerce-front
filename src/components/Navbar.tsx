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
import bioLogo from '../pictures/bioLogo.png'

const Navbar = (): JSX.Element => {
  const { storeToken, authenticateUser, isLoggedIn, user } =
    useContext(AuthContext) as AuthContextInterface;
  const { offlineCartState, getItemsFromOffLineCart, cartState, logOutAndEraseStateAndLS } = useContext(
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
    console.log('CART : ',cartState,cartState.length)
    if (isLoggedIn) { 
      setItemsNumberState(cartState.length);
    }else{
      //check 'offline Cart'
      setItemsNumberState(0)
    }

  }, [isLoggedIn, cartState]);

  return (
    <div className="Navbar">
      <Link className="logo" to="/"><img src={bioLogo} alt='logo'/></Link>
      <Link to="/">
        <h1>ECOMMERCE</h1>
      </Link>
      <div className="Navbar__rightSide">
        {isLoggedIn ? (
          <div className="Navbar__logPart">
            <Link to="/user"><p>{user && user.email}</p></Link>
            <p onClick={logOutAndEraseStateAndLS} className="logOut">LogOut</p>
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
      
    </div>
  );
};

export default Navbar;
