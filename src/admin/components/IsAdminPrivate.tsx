import { useContext } from "react";
import { AdminAuthContext } from "../../context/adminAuth.context";
import { Navigate } from "react-router-dom";
import { AdminAuthContextInterface } from "../../@types/adminAuthContext.type";

type isAdminPrivateType={
  children: JSX.Element
}

function IsAdminPrivate( { children }:isAdminPrivateType ):JSX.Element  {
  const { isAdminLoggedIn, isLoading } = useContext(AdminAuthContext)as AdminAuthContextInterface;
  if (isLoading) return <p>Loading ...</p>;
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" />;
  } else {
    return children;
  }
}

export default IsAdminPrivate;
