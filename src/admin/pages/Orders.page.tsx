import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { OrderInterface } from '../../@types/order.type'
import { OrderOverview } from "../components/OrderOverview";
import { Spinner } from "../../components/Spinner";

// import { AdminAuthContext } from "../../context/adminAuth.context";
// import { AdminAuthContextInterface } from "../../@types/adminAuthContext.type";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const OrdersPage = () => {
  //   const { isAdminLoggedIn, isLoading } = useContext(
  //     AdminAuthContext
  //   ) as AdminAuthContextInterface;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ordersState, setOrdersState ] = useState<OrderInterface[]>([])

  useEffect(() => {
    const token= localStorage.getItem('adminAuthToken')
    setIsLoading(true);
    axios
      .get(`${API_URL}/order`, {
        headers: {
          isadmin: "true",
          Authorization: `BEARER ${token}`
        },
      })
      .then((ans) => {
        setIsLoading(false);
        setIsLoaded(true);
        console.log("orders : ", ans.data);
        setOrdersState(ans.data)
      })
      .catch((err) => {
        setIsError(true);
      });
  }, []);

  return (<div className="OrdersPage">
    {isLoading && <Spinner/>}
    <ul>
      {isLoaded && ordersState.map(order=><OrderOverview key={order._id} order={order}/>)}
    </ul>
    
  </div>);
};
