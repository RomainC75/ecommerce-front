import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import axios from "axios";
import {
  cartContextInterface,
  cartPopulatedInterface,
  CartToOrderInterface,
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
  isProductToOrderInterfaceArray,
} from "../tools/typeTests";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const CartContext = createContext<cartContextInterface | null>(null);

function CartProviderWrapper(props: PropsWithChildren<{}>) {
  const [productsState, setProductsState] = useState<ProductToOrderInterface[]>(
    []
  );
  const { isLoggedIn, logOutUser } =
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

  const patchNewCart = async (newCart: ProductToOrderInterface[] ): Promise<boolean> => {
    const storedToken = localStorage.getItem("authToken");
    console.log("new cart to store :: ", newCart);
    try {
      const ans = await axios.patch(`${API_URL}/cart`, newCart, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
      console.log("patch ans :", ans.data);
      localStorage.setItem("cart", JSON.stringify(ans.data));
      setCartState(ans.data.products);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateQuantityOnOneItemAndPatch = async (id: string,quantity: number): Promise<boolean> => {
    const newCartToSend:ProductToOrderInterface[] = cartState.map(item=>{
      const newQuantity= item.productId._id===id ? quantity:item.quantity
        return{
          productId:item.productId._id,
          quantity:newQuantity
        }
    })
    console.log('newCartToSend',newCartToSend)
    try {
      return patchNewCart(newCartToSend)
    } catch (error) {
      return false;
    }
  };

  const postNewCart = (newProduct: ProductToOrderInterface[]): void => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .post(API_URL + "/cart", newProduct, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((ans) => {
        console.log("-->post ans : ", ans.data);
        localStorage.setItem("cart", JSON.stringify(ans.data));
        setCartState(ans.data.products);
      });
  };

  const addItemToOnlineCart = (
    itemId: string,
    quantity: number,
    fullProduct: ProductInterface
  ): void => {
    console.log("entering addItemToOnlineCart !",itemId,quantity,fullProduct);
    const onlineCartStorageStr: string | null = localStorage.getItem("cart");
    if (onlineCartStorageStr) {
      const onlineCartStorage: cartPopulatedInterface =
        JSON.parse(onlineCartStorageStr);
      console.log('=====>test : ',isCartPopulatedInterface(onlineCartStorage))
      console.log("onlineCartStorage : ", onlineCartStorage);
      if (isCartPopulatedInterface(onlineCartStorage)) {
        console.log("preindex : ", onlineCartStorage);
        const index: number = onlineCartStorage.products.findIndex(
          (product) => product.productId._id === itemId
        );
        console.log("index : ", index);
        if (index >= 0) {
          onlineCartStorage.products[index].quantity += quantity;
          const cartToPatch: ProductToOrderInterface[] =
            onlineCartStorage.products.map((product) => {
              return {
                productId: product.productId._id,
                quantity: product.quantity,
              };
            });
          patchNewCart(cartToPatch);
        } else {
          const cartToPatch: ProductToOrderInterface[] =
            onlineCartStorage.products.map((product) => {
              return {
                productId: product.productId._id,
                quantity: product.quantity,
              };
            });
          cartToPatch.push({ productId: itemId, quantity: quantity });
          patchNewCart(cartToPatch);
        }
      }
    } else {
      
      postNewCart([
        {
          productId: itemId,
          quantity,
        },
      ]);
    }
  };


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
          setCartState(ans.data.products);
        }else{
          localStorage.removeItem('cart')
          setCartState([])
        }
      })
      
  };

  const patchTheUpdatedCart = (
    newProdList: ProductToOrderInterface[]
  ): void => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .patch(API_URL + "/cart", newProdList, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((ans) => {
        console.log("------> post ans : ", ans.data);
        getOnlineCartAndRecordToStateAndLS();
      });
  };


  const removeFromCartById = (id: string): void => {
    console.log("id : ", id);
    console.log("cartState : ", cartState);
    const newCart = cartState
      .filter((populatedCartList) => populatedCartList.productId._id !== id)
      .map((filteredPopulatedCartList) => {
        return {
          productId: filteredPopulatedCartList.productId._id,
          quantity: filteredPopulatedCartList.quantity,
        };
      });
    console.log(newCart);
    patchTheUpdatedCart(newCart);
  };

  const getNewPromoPrice = (basePrice:number, promo:number):number =>{  
    return basePrice - basePrice*promo/100
  }

  const getTotal = ():string =>{
    return cartState.reduce((accu:number,currentProd:PopulatedProductToOrderInterface)=>{
      if("promo" in currentProd.productId && currentProd.productId.promo){
        return accu+ getNewPromoPrice(currentProd.productId.price,currentProd.productId.promo)*currentProd.quantity
      }else{
        return accu+ currentProd.productId.price*currentProd.quantity
      }
    },0).toFixed(2)
  }



  const validateCartWithCreditCard = (infos:CartToOrderInterface):Promise<boolean>=>{
    const storedToken = localStorage.getItem('authToken')
    return new Promise (async(resolve,reject)=>{
      try {
        axios({
          url:API_URL+'/cart/checkout',
          method:"POST",
          headers:{
            authorization:`BEARER ${storedToken}`
          },
          data:infos
        }).then(ans=>{
          console.log('ans : ',ans.data)
          resolve(true)
        })
        .catch(err=>{
          console.log("validateCardWithCreditCard" ,err)
          reject(false)
        })
      } catch (error) {
        console.log("validateCardWithCreditCard" ,error)
        reject(false)
      }
    })
  }

  const logOutAndEraseStateAndLS = (): void => {
    logOutUser();
    setCartState([]);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      getOnlineCartAndRecordToStateAndLS();
    } else {
      console.log("-->", getItemsFromOffLineCart());
      setOfflineCartState(getItemsFromOffLineCart());
    }
  }, [isLoggedIn]);

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
        logOutAndEraseStateAndLS,
        updateQuantityOnOneItemAndPatch,
        getNewPromoPrice,
        getTotal,
        validateCartWithCreditCard,
        getOnlineCartAndRecordToStateAndLS
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProviderWrapper };
