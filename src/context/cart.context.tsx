import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  PropsWithChildren,
} from "react";
import axios from "axios";
import {
  cartContextInterface,
  cartInterface,
  cartPopulatedInterface,
} from "../@types/cartContext.type";
import { AuthContext } from "./auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import {
  ProductToOrderInterface,
  PopulatedProductToOrderInterface,
  ProductInterface,
} from "../@types/product";
import {
  isCartPopulatedInterface,
  isProductToOrderInterface,
  isProductToOrderInterfaceArray,
} from "../tools/typeTests";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const CartContext = createContext<cartContextInterface | null>(null);

function CartProviderWrapper(props: PropsWithChildren<{}>) {
  const [productsState, setProductsState] = useState<ProductToOrderInterface[]>(
    []
  );
  const { storeToken, authenticateUser, isLoggedIn, user, logOutUser } =
    useContext(AuthContext) as AuthContextInterface;
  const [offlineCartState, setOfflineCartState] = useState<
    ProductToOrderInterface[]
  >([]);
  const [cartState, setCartState] = useState<
    PopulatedProductToOrderInterface[]
  >([]);

  const addItemToOfflineCart = (item: ProductToOrderInterface): void => {
    const offlineCartLStorageStr: string | null =
      localStorage.getItem("offlineCart");
    if (offlineCartLStorageStr) {
      const offlineCartLStorage: ProductToOrderInterface[] = JSON.parse(
        offlineCartLStorageStr
      );
      if (isProductToOrderInterfaceArray(offlineCartLStorage)) {
        const foundIndex: number = offlineCartLStorage.findIndex(
          (offlineItem) => offlineItem.productId === item.productId
        );
        if (foundIndex >= 0) {
          offlineCartLStorage[foundIndex].quantity += item.quantity;
          localStorage.setItem(
            "offlineCart",
            JSON.stringify(offlineCartLStorage)
          );
          setOfflineCartState(offlineCartLStorage);
        } else {
          offlineCartLStorage.push(item);
          localStorage.setItem(
            "offlineCart",
            JSON.stringify(offlineCartLStorage)
          );
          setOfflineCartState(offlineCartLStorage);
        }
      } else {
        offlineCartLStorage.push(item);
        localStorage.setItem(
          "offlineCart",
          JSON.stringify(offlineCartLStorage)
        );
        setOfflineCartState(offlineCartLStorage);
      }
    } else {
      localStorage.setItem("offlineCart", JSON.stringify([item]));
      setOfflineCartState([item]);
    }
  };

  const patchNewCart = (newCart:ProductToOrderInterface[]):void =>{
    const storedToken = localStorage.getItem('authToken')
    console.log('new cart to store :: ',newCart)
    axios.patch(`${API_URL}/cart`,newCart,{
      headers:{
        Authorization:`Bearer ${storedToken}`
      }
    }).then(ans=>{
      console.log('patch ans :',ans.data)
      localStorage.setItem('cart',JSON.stringify(ans.data))
      setCartState(ans.data.products)
    })
  }

  const postNewCart = (newProduct:ProductToOrderInterface[]):void =>{
    const storedToken = localStorage.getItem('authToken')
    axios.post(API_URL+'/cart',newProduct,{
      headers:{
        Authorization:`Bearer ${storedToken}`
      }
    }).then(ans=>{
      console.log('-->post ans : ',ans.data)
      localStorage.setItem('cart',JSON.stringify(ans.data))
      setCartState(ans.data.products)
    })
  }

  const addItemToOnlineCart = (itemId:string, quantity:number, fullProduct:ProductInterface): void => {
    console.log('entering addItemToOfflineCart !')
    const onlineCartStorageStr: string | null =localStorage.getItem('cart')
    if(onlineCartStorageStr){
      const onlineCartStorage: cartPopulatedInterface=JSON.parse(onlineCartStorageStr)
      // console.log('test : ',isCartPopulatedInterface(onlineCartStorage))
      console.log('onlineCartStorage : ',onlineCartStorage)
      if(isCartPopulatedInterface(onlineCartStorage)){
        console.log('preindex : ', onlineCartStorage)
        const index:number = onlineCartStorage.products.findIndex(product=>product.productId._id===itemId)
        console.log('index : ',index )
        if(index>=0){
          onlineCartStorage.products[index].quantity+=quantity
          const cartToPatch:ProductToOrderInterface[]=onlineCartStorage.products.map(product=>{return{productId:product.productId._id,quantity:product.quantity}})
          patchNewCart(cartToPatch)
        }else{
          console.log('!!!!!!!!!!!!')
          const cartToPatch:ProductToOrderInterface[]=onlineCartStorage.products.map(product=>{return{productId:product.productId._id,quantity:product.quantity}})
          cartToPatch.push({productId:itemId,quantity:quantity})
          patchNewCart(cartToPatch)
        }
      }
    }else{
      postNewCart([{
        productId:itemId,
        quantity
      }])
    }
  }

  const getItemsFromOffLineCart = (): ProductToOrderInterface[] => {
    const offlineCartStr: string | null = localStorage.getItem("offlineCart");
    if (!offlineCartStr) {
      return [];
    }
    const offLineCartLStorage = JSON.parse(offlineCartStr);
    if (
      !offLineCartLStorage ||
      !isProductToOrderInterfaceArray(offLineCartLStorage)
    ) {
      localStorage.removeItem("offlineCart");
      return [];
    }
    return offLineCartLStorage;
  };
//////////////////////////////////////////////////////////////

  const getOnlineCartAndRecordToStateAndLS = (): void => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(API_URL + "/cart", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((ans) => {
        console.log("ans : ", ans.data);
        if (ans.data) {
          localStorage.setItem("cart", JSON.stringify(ans.data));
          setCartState(ans.data.products)
        }
      });
  };

  const patchTheUpdatedCart = (newProdList: ProductToOrderInterface[]):void => {
    const storedToken = localStorage.getItem("authToken");
    axios.patch(API_URL+'/cart',newProdList,{
      headers:{
        Authorization:`Bearer ${storedToken}`
      }
    }).then(ans=>{
      console.log('------> post ans : ',ans.data)
      getOnlineCartAndRecordToStateAndLS()
    })
  };

  

  const removeFromCartById = (id: string): void => {
    console.log("id : ", id);
    console.log("cartState : ", cartState);
    const newCart = cartState
      .filter((populatedCartList) => populatedCartList.productId._id !== id)
      .map((filteredPopulatedCartList) => {
        return {
          productId:filteredPopulatedCartList.productId._id,
          quantity:filteredPopulatedCartList.quantity
        }
      });
    console.log(newCart);
    patchTheUpdatedCart(newCart)
  };

  const logOutAndEraseStateAndLS = ():void =>{
    logOutUser()
    setCartState([])
    localStorage.removeItem('cart')
  }

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      getOnlineCartAndRecordToStateAndLS()
    } else {
      console.log("-->", getItemsFromOffLineCart());
      setOfflineCartState(getItemsFromOffLineCart());
    }
  }, [isLoggedIn]);

  //loggedIn

  // const addToCart = (product:ProductToOrderInterface):void =>{
  //   if(isLoggedIn){
  //     if()
  //   }else{

  //   }
  // }

  return (
    <CartContext.Provider
      value={{
        productsState,
        setProductsState,
        addItemToOfflineCart,
        getItemsFromOffLineCart,
        offlineCartState,
        cartState,
        removeFromCartById,
        addItemToOnlineCart,
        logOutAndEraseStateAndLS
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProviderWrapper };
