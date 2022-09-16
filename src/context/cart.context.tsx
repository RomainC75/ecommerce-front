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
  OfflinePopulatedCartInterface,
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
  const { isLoggedIn, logOutUser } = useContext(
    AuthContext
  ) as AuthContextInterface;
  const [offlineCartState, setOfflineCartState] = useState<
    OfflinePopulatedCartInterface | null
  >(null);
  const [cartState, setCartState] = useState<
    PopulatedProductToOrderInterface[]
  >([]);

  const addItemToOfflineCart = (
    fullProduct: ProductInterface,
    quantity: number): void => {
    console.log("addItemsToOfflineCart")
    let newOfflineCart : OfflinePopulatedCartInterface | null = null
    const offlineCartLStorageStr: string | null =
      localStorage.getItem("offlineCart");
    if (offlineCartLStorageStr) {
      const offlineCartLStorage: any | null = JSON.parse(
        offlineCartLStorageStr
      );
      if (isCartPopulatedInterface(offlineCartLStorage)) {
        console.log('offline products content : ', offlineCartLStorage.products)
        newOfflineCart = pushNewProductOrUpdateQuantityAndReturnObj(offlineCartLStorage,fullProduct,quantity)
        
      } else {
        newOfflineCart = createNewOfflineCartObj(quantity,fullProduct)
      }
    } else {
      newOfflineCart = createNewOfflineCartObj(quantity,fullProduct)
    }
    localStorage.setItem('offlineCart', JSON.stringify(newOfflineCart))
    setOfflineCartState(newOfflineCart);
  };

  const pushNewProductOrUpdateQuantityAndReturnObj = (existingCart: OfflinePopulatedCartInterface, fullProduct: ProductInterface, quantity:number):OfflinePopulatedCartInterface =>{
    const foundIndex = existingCart.products.findIndex(prod=>prod.productId._id===fullProduct._id)
    console.log("foundIndex",foundIndex)
    if(foundIndex>=0){
      console.log('update quantity+productInfos')
      existingCart.products[foundIndex].productId=fullProduct
      existingCart.products[foundIndex].quantity+=quantity
    }else{
      console.log('push new products+qty')
      existingCart.products.push({
          productId:fullProduct,
          quantity
        })
    }
    const now = new Date()
    existingCart.updatedAt=now.toISOString()
    return existingCart
  }

  const createNewOfflineCartObj = (
    quantity: number,
    fullProduct: ProductInterface):OfflinePopulatedCartInterface =>{
      const now = new Date()
      const isoString = now.toISOString()
      const newOfflineCartObj = {
        products: [
          {productId: fullProduct, quantity }
        ],
        updatedAt: isoString,
        createdAt: isoString
      }
      // localStorage.setItem('offlineCart', JSON.stringify(newOfflineCartObj))
      return newOfflineCartObj;
  }

  const patchNewCart = async (
    newCart: ProductToOrderInterface[]
  ): Promise<boolean> => {
    const storedToken = localStorage.getItem("authToken");
    console.log("new cart to store :: ", newCart);
    try {
      const ans = await axios.patch(`${API_URL}/cart`, newCart, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      console.log("patch ans :", ans.data);
      localStorage.setItem("cart", JSON.stringify(ans.data));
      setCartState(ans.data.products);
      return true;
    } catch (error) {
      return false;
    }
  };

  const postNewCart = (
    newProduct: ProductToOrderInterface[]
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const ans = await axios.post(API_URL + "/cart", newProduct, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (ans) {
          console.log("-->post ans : ", ans.data);
          localStorage.setItem("cart", JSON.stringify(ans.data));
          setCartState(ans.data.products);
          resolve(true);
        }
        reject(false);
      } catch (error) {
        reject(false);
      }
    });
  };

  // const postNewCart = (newProduct: ProductToOrderInterface[]): void => {
  //   const storedToken = localStorage.getItem("authToken");
  //   axios
  //     .post(API_URL + "/cart", newProduct, {
  //       headers: {
  //         Authorization: `Bearer ${storedToken}`,
  //       },
  //     })
  //     .then((ans) => {
  //       if(ans){
  //         console.log("-->post ans : ", ans.data);
  //         localStorage.setItem("cart", JSON.stringify(ans.data));
  //         setCartState(ans.data.products);
  //       }
  //     });
  // };

  const updateQuantityOnOneItemAndPatch = async (
    id: string,
    quantity: number
  ): Promise<boolean> => {
    const newCartToSend: ProductToOrderInterface[] = cartState.map((item) => {
      const newQuantity = item.productId._id === id ? quantity : item.quantity;
      return {
        productId: item.productId._id,
        quantity: newQuantity,
      };
    });
    console.log("newCartToSend", newCartToSend);
    try {
      return patchNewCart(newCartToSend);
    } catch (error) {
      return false;
    }
  };

  const addItemToOnlineCart = async(
    itemId: string,
    quantity: number,
    fullProduct: ProductInterface
  ): Promise<boolean> => {
    console.log(
      "entering addItemToOnlineCart !",
      itemId,
      quantity,
      fullProduct
    );
    const onlineCartStorageStr: string | null = localStorage.getItem("cart");
    if (onlineCartStorageStr) {
      const onlineCartStorage: cartPopulatedInterface =
        JSON.parse(onlineCartStorageStr);
      console.log("=====>test : ", isCartPopulatedInterface(onlineCartStorage));
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
          return await patchNewCart(cartToPatch);
        } else {
          const cartToPatch: ProductToOrderInterface[] =
            onlineCartStorage.products.map((product) => {
              return {
                productId: product.productId._id,
                quantity: product.quantity,
              };
            });
          cartToPatch.push({ productId: itemId, quantity: quantity });
          return await patchNewCart(cartToPatch);
        }
      }
      return new Promise((resolve,reject)=>reject(false))
    } else {
      console.log("POST NEW CARD");
      return await postNewCart([
        {
          productId: itemId,
          quantity,
        },
      ]);
    }
    
  };

  const getOffLineCartOrCleanIfDataIsCorrupted = (): OfflinePopulatedCartInterface | null => {
    const offlineCartStr: string | null = localStorage.getItem('offlineCart');
    if (!offlineCartStr) {
      return null;
    }
    const offLineCartLStorage = JSON.parse(offlineCartStr);
    if (
      !offLineCartLStorage ||
      !isCartPopulatedInterface(offLineCartLStorage)
    ) {
      localStorage.removeItem("offlineCart");
      return null;
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
        } else {
          localStorage.removeItem("cart");
          setCartState([]);
        }
      });
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

  const getNewPromoPrice = (basePrice: number, promo: number): number => {
    return basePrice - (basePrice * promo) / 100;
  };

  const getTotal = (): string => {
    return cartState
      .reduce((accu: number, currentProd: PopulatedProductToOrderInterface) => {
        if ("promo" in currentProd.productId && currentProd.productId.promo) {
          return (
            accu +
            getNewPromoPrice(
              currentProd.productId.price,
              currentProd.productId.promo
            ) *
              currentProd.quantity
          );
        } else {
          return accu + currentProd.productId.price * currentProd.quantity;
        }
      }, 0)
      .toFixed(2);
  };

  const validateCartWithCreditCard = (
    infos: CartToOrderInterface
  ): Promise<boolean> => {
    const storedToken = localStorage.getItem("authToken");
    return new Promise(async (resolve, reject) => {
      try {
        axios({
          url: API_URL + "/cart/checkout",
          method: "POST",
          headers: {
            authorization: `BEARER ${storedToken}`,
          },
          data: infos,
        })
          .then((ans) => {
            console.log("ans : ", ans.data);
            resolve(true);
          })
          .catch((err) => {
            console.log("validateCardWithCreditCard", err);
            reject(false);
          });
      } catch (error) {
        console.log("validateCardWithCreditCard", error);
        reject(false);
      }
    });
  };

  const logOutAndEraseStateAndLS = (): void => {
    logOutUser();
    setCartState([]);
    localStorage.removeItem("cart");
  };

  const addItemToCart = (
    itemId: string,
    quantity: number,
    fullProduct: ProductInterface
    ) =>{
    if(isLoggedIn){
      return addItemToOnlineCart(itemId,quantity,fullProduct)
    }else{
      // return addItemToOfflineCart(itemId,quantity,fullProduct)
    }
  }

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      getOnlineCartAndRecordToStateAndLS();
    } else {
      console.log("-->getOfflineCartOrCleanIfDataIsCorrupted", getOffLineCartOrCleanIfDataIsCorrupted());
      setOfflineCartState(getOffLineCartOrCleanIfDataIsCorrupted());
    }
  }, [isLoggedIn]);

  return (
    <CartContext.Provider
      value={{
        productsState,
        setProductsState,
        addItemToOfflineCart,
        offlineCartState,
        cartState,
        removeFromCartById,
        addItemToOnlineCart,
        logOutAndEraseStateAndLS,
        updateQuantityOnOneItemAndPatch,
        getNewPromoPrice,
        getTotal,
        validateCartWithCreditCard,
        getOnlineCartAndRecordToStateAndLS,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProviderWrapper };
