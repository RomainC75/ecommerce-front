import React, { useState, useEffect, createContext, useContext, ReactNode, PropsWithChildren } from "react";
import axios from "axios";
import { cartContextInterface, cartInterface } from '../@types/cartContext.type' 
import { AuthContext } from "./auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import { ProductToOrderInterface, PopulatedProductToOrderInterface } from "../@types/product";
import { isProductToOrderInterface, isProductToOrderInterfaceArray } from "../tools/typeTests";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const CartContext = createContext<cartContextInterface | null>(null);

function CartProviderWrapper(props:PropsWithChildren<{}>) {
  const [ productsState , setProductsState ] = useState<ProductToOrderInterface[]>([])
  const { storeToken, authenticateUser, isLoggedIn, user, logOutUser } = useContext(AuthContext) as AuthContextInterface;
  const [offlineCartState, setOfflineCartState ] = useState<ProductToOrderInterface[]>([])
  const [ cartState, setCartState ] = useState<PopulatedProductToOrderInterface[]>([])

  const addItemToOfflineCart = (item:ProductToOrderInterface):void =>{
    const  offlineCartLStorageStr: string | null = localStorage.getItem('offlineCart')
    if(offlineCartLStorageStr){
      const offlineCartLStorage: ProductToOrderInterface[] = JSON.parse(offlineCartLStorageStr)  
      if(isProductToOrderInterfaceArray(offlineCartLStorage)){
        const foundIndex:number = offlineCartLStorage.findIndex(offlineItem=>offlineItem.productId === item.productId)
        if(foundIndex >=0){
          offlineCartLStorage[foundIndex].quantity+=item.quantity
          localStorage.setItem('offlineCart',JSON.stringify(offlineCartLStorage))
          setOfflineCartState(offlineCartLStorage)
        }else{
          offlineCartLStorage.push(item)
          localStorage.setItem('offlineCart',JSON.stringify(offlineCartLStorage))
          setOfflineCartState(offlineCartLStorage)
        }
      }else{
        offlineCartLStorage.push(item)
        localStorage.setItem('offlineCart',JSON.stringify(offlineCartLStorage))
        setOfflineCartState(offlineCartLStorage)
      }
    }else{
      localStorage.setItem('offlineCart',JSON.stringify([item]))
      setOfflineCartState([item])
    }
  }

  const getItemsFromOffLineCart = ():ProductToOrderInterface[] =>{
    const offlineCartStr:string | null = localStorage.getItem('offlineCart')
    if(!offlineCartStr){
      return []
    }
    const offLineCartLStorage = JSON.parse(offlineCartStr)
    if(!offLineCartLStorage || !isProductToOrderInterfaceArray(offLineCartLStorage)){
      localStorage.removeItem('offlineCart')
      return []
    }
    return offLineCartLStorage
  }

  const getOnlineCartAndRecord = (newItem:ProductToOrderInterface):void =>{
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

  const postTheNewCart = (newProdList:ProductToOrderInterface[]) =>{
      //refresh
    }

  const removeFromCartById = (id:string):void =>{
      //get the cart
      //remove
      // postTheNewCart(newProdList)
    }

  useEffect(()=>{
    console.log("isLoggedIn",isLoggedIn)
    if(isLoggedIn){
      const storedToken:string|null = localStorage.getItem('authToken')
      axios.get(API_URL+'/cart',{
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then(ans=>{
        console.log('online Cart : ',ans.data.products)
        setCartState(ans.data.products)
      })
      .catch()
    }else{
      console.log('-->',getItemsFromOffLineCart())
      setOfflineCartState(getItemsFromOffLineCart())
    }
  },[isLoggedIn])

  
  //loggedIn

  // const addToCart = (product:ProductToOrderInterface):void =>{
  //   if(isLoggedIn){
  //     if()
  //   }else{

  //   }
  // }

  return (
    <CartContext.Provider value={{ productsState, setProductsState, addItemToOfflineCart, getItemsFromOffLineCart, offlineCartState, cartState }}>
      {props.children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProviderWrapper };
