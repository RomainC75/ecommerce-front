import React, { useState, useEffect, createContext, useContext, ReactNode, PropsWithChildren } from "react";
import axios from "axios";
import { cartContextInterface, cartInterface } from '../@types/cartContext.type' 
import { AuthContext } from "./auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import { ProductToOrderInterface } from "../@types/product";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const CartContext = createContext<cartContextInterface | null>(null);

function CartProviderWrapper(props:PropsWithChildren<{}>) {
  const [ productsState , setProductsState ] = useState<cartInterface | null>(null)
  const { storeToken, authenticateUser, isLoggedIn, user, logOutUser } = useContext(AuthContext) as AuthContextInterface;
  
  const getCartAndRecord = ():void =>{
    const storedToken = localStorage.getItem('authToken')
      axios.get(API_URL+'/cart',{
        headers:{
          Authorization: `Bearer ${storedToken}`
        }
      })
        .then(ans=>{
          console.log('ans : ',ans.data)
          if(ans.data){
            localStorage.setItem('cart',JSON.stringify(ans.data))
          }
        })
  }

  useEffect(()=>{
    if(isLoggedIn){
      
    }
  },[isLoggedIn])

  

  const addToCart = (product:ProductToOrderInterface):void =>{
    if(isLoggedIn){
      if()
    }else{

    }
  }

  return (
    <CartContext.Provider value={{ productsState, setProductsState }}>
      {props.children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProviderWrapper };
