// src/components/IsPrivate.js

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import { AuthContextInterface } from "../@types/authContext.type";

type isPrivateType={
  children:JSX.Element
}

function IsCartValidated( { children }:isPrivateType ):JSX.Element  {
  const res=localStorage.getItem('isCurrentCartValidated')
  if(res && JSON.parse(res)){
    return children
  }else{
    return <Navigate to="/basket"/>;
  }
}

export default IsCartValidated;
