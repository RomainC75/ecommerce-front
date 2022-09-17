import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";

import { FaShoppingCart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Button from '@mui/material/Button';

import "./style/navbar.css";
import bioLogo from '../pictures/bioLogo.png'

const Navbar = (): JSX.Element => {
  const { authenticateUser, isLoggedIn, user } =
    useContext(AuthContext) as AuthContextInterface;
  const { cartState, logOutAndEraseStateAndLS } = useContext(
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
    setItemsNumberState(cartState.length);
  }, [isLoggedIn, cartState]);

  return (
    <div className="Navbar">
      <Link className="logo" to="/"><img src={bioLogo} alt='logo'/></Link>
      <Link to="/">
        <h1>BioCoop'</h1>
      </Link>
      <div className="Navbar__rightSide">
        {isLoggedIn ? (
          <div className="Navbar__logPart">
            {user && user.imageUrl.length>0 && <img className = "Navbar__rightSide__avatarImage" src={ user.imageUrl}/>}
            <Link to="/account"><p>{user && user.email}</p></Link>
            <Button variant="outlined" color="error" onClick={logOutAndEraseStateAndLS} className="logOutButton">LogOut</Button>
          </div>
        ) : (
          <div className="signupAndLogin">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
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
