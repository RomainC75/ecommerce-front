import React, { useState } from "react";
import { OrderInterface } from "../../@types/order.type";
import { PrintDate } from "./PrintDate";

import { Button } from "@mui/material";
import "./style/orderOverview.css";
import axios from "axios";
import { OrderDetails } from "./OrderDetails";

interface OrderOverviewInterface {
  order: OrderInterface;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const OrderOverview = (props: OrderOverviewInterface): JSX.Element => {
  const { order } = props;
  const [orderState, setOrderState] = useState<OrderInterface>(order);
  const [shippingButtonState, setShippingButtonState] = useState<
    "paid" | "shipped"
  >("paid");
  const [shippingButtonColorState, setShippingButtonColorState] = useState<
    "primary" | "success" | "error"
  >("primary");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showDetailsButtonState, setShowDetailsButtonState] =
    useState<boolean>(false);

  const setToShipped = (): Promise<OrderInterface | null> => {
    const token = localStorage.getItem("adminAuthToken");
    return new Promise(async (resolve, reject) => {
      try {
        const ans = await axios.get(
          `${API_URL}/order/shipped/${orderState._id}`,
          {
            headers: {
              isadmin: "true",
              Authorization: `BEARER ${token}`,
            },
          }
        );
        resolve(ans.data);
      } catch (error) {
        reject(false);
      }
    });
  };

  const handleShippingButton = async () => {
    try {
      const res: OrderInterface | false | null = await setToShipped();
      console.log("res : ", res);
      if (res) {
        setShippingButtonState("shipped");
        setShippingButtonColorState("success");
        setOrderState(res);
      }
    } catch (error) {
      setShippingButtonColorState("error");
    }
  };

  const toggleShowDetailsButton = () => {
    setShowDetailsButtonState(!showDetailsButtonState);
    setShowDetails(!showDetails);
  };

  return (
    <div className="OrderOverview">
      <li className="overview">
        <div className="column">
          <p>Date :</p>
          <PrintDate date={orderState.createdAt} />
          <Button onClick={toggleShowDetailsButton}>
            {showDetailsButtonState ? "hide" : "show"}
          </Button>
        </div>
        <div>
          <div className="column">
            <p>Location</p>
            <p>
              {orderState.shipping.address.zip}{" "}
              {orderState.shipping.address.city}
            </p>
          </div>
          <Button
            variant="contained"
            onClick={handleShippingButton}
            color={shippingButtonColorState}
          >
            {shippingButtonState}
          </Button>
        </div>
        <div className="right">
          <div className="column">
            <p>Price:</p>
            <p>{orderState.totalCost}</p>
          </div>
          <div className="column">
            <p>status :</p>
            <p>{orderState.payementStatus}</p>
          </div>
        </div>
      </li>
      { showDetails && 
        <div className="details">
          <ul>
            {orderState.products.map( (product,i)=><OrderDetails key={`${orderState._id}-${product.productId._id}-${i}`} product={product} orderId={orderState._id}/>)}
          </ul>
        </div>}
    </div>
  );
};
