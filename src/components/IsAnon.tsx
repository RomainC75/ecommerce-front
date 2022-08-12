import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import { AuthContextInterface } from "../@types/authContext.type";

type isAnonType={
  children:JSX.Element
}

function IsAnon({ children }:isAnonType):JSX.Element {
  const { isLoggedIn, isLoading } = useContext(AuthContext) as AuthContextInterface;
  if (isLoading) return <p>Loading ...</p>;
  if (isLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default IsAnon;
