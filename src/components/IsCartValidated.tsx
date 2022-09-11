import { Navigate } from "react-router-dom";

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
