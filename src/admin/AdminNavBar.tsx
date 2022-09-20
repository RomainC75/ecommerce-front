import { useState, useEffect, useContext } from "react";
import { AdminAuthContext } from "../context/adminAuth.context";
import { AdminAuthContextInterface } from "../@types/adminAuthContext.type";
import { Link, useNavigate } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Button from "@mui/material/Button";

import "./style/adminNavbar.css";
import bioLogo from "../pictures/bioLogo.png";

const AdminNavbar = (): JSX.Element => {
  const { authenticateAdmin, isAdminLoggedIn, admin, logOutAdmin } = useContext(
    AdminAuthContext
  ) as AdminAuthContextInterface;

  const [itemsNumberState, setItemsNumberState] = useState<number>(0);
  const navigate = useNavigate();

  const goToTheBasket = () => {
    if (itemsNumberState > 0) {
      navigate("/basket");
    }
  };

  useEffect(() => {
    authenticateAdmin();
  }, []);

  return (
    <div className="AdminNavbar">
      <Link className="logo" to="/">
        <img src={bioLogo} alt="logo" />
      </Link>
      <Link to="/">
        <h1>BioCoop'</h1>
      </Link>
      <div className="Navbar__rightSide">
        {isAdminLoggedIn ? (
          <div className="Navbar__logPart">
            {admin && admin.imageUrl.length > 0 && (
              <img
                className="Navbar__rightSide__avatarImage"
                src={admin.imageUrl}
              />
            )}
            <Link to="/account">
              <p>{admin && admin.email}</p>
            </Link>
            <Button
              variant="outlined"
              color="error"
              onClick={logOutAdmin}
              className="logOutButton"
            >
              LogOut
            </Button>
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
              <div className="Navbar__shopping__number">
                {itemsNumberState}
              </div>
            </>
          ) : (
            <FiShoppingCart className="basketIcon" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
