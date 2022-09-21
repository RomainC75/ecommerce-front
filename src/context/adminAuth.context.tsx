import { useState, useEffect, createContext, PropsWithChildren } from "react";
import axios from "axios";
import { AdminAuthContextInterface, AdminInterface } from "../@types/adminAuthContext.type";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const AdminAuthContext = createContext<AdminAuthContextInterface | null>(null);

function AdminAuthProviderWrapper(props:PropsWithChildren<{}>) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [admin, setAdmin] = useState<AdminInterface | null>(null);
  const navigate = useNavigate()
  const storeToken = (token:string):void => {
    localStorage.setItem("adminAuthToken", token);
  };

  const authenticateAdmin = ():void => {
    const storedToken = localStorage.getItem("adminAuthToken");
    if (storedToken) {
      setIsLoading(true);
      axios
        .get(`${API_URL}/auth/verify`, {
          headers: {
            isadmin:"true",
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((ans) => {
          setIsAdminLoggedIn(true);
          setIsLoading(false);
          setAdmin(ans.data);
        })
        .catch(() => {
          setIsAdminLoggedIn(false);
          setIsLoading(false);
          setAdmin(null);
          localStorage.removeItem('adminAuthToken')
        });
    } else {
      setIsAdminLoggedIn(false);
      setIsLoading(false);
      setAdmin(null);
      navigate('/admin/login')
    }
  };

  const removeToken = ():void => {
    localStorage.removeItem("adminAuthToken");
  }

  const logOutAdmin = ():void => {  
    removeToken();
    authenticateAdmin();
    navigate('/')
  }  

  useEffect(() => {                                    
    authenticateAdmin()
   }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, isLoading, admin, storeToken, authenticateAdmin, logOutAdmin }}>
      {props.children}
    </AdminAuthContext.Provider>
  );
}

export { AdminAuthContext, AdminAuthProviderWrapper };
