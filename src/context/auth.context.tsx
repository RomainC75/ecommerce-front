import { useState, useEffect, createContext, PropsWithChildren } from "react";
import axios from "axios";
import { AuthContextInterface, UserInterface } from "../@types/authContext.type";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const AuthContext = createContext<AuthContextInterface | null>(null);

function AuthProviderWrapper(props:PropsWithChildren<{}>) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface | null>(null);
  const navigate = useNavigate()
  const storeToken = (token:string):void => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = ():void => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setIsLoading(true);
      axios
        .get(`${API_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((ans) => {
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(ans.data);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
          localStorage.removeItem('authToken')
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = ():void => {
    localStorage.removeItem("authToken");
  }

  const logOutUser = ():void => {  
    removeToken();
    authenticateUser();
    navigate('/')
  }  

  useEffect(() => {                                    
    authenticateUser()
   }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, storeToken, authenticateUser, logOutUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProviderWrapper };
