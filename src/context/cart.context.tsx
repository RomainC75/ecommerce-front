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
  isCartPopulatedInterface,isArrayOfProductInterface
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
  const [cartState, setCartState] = useState<
    PopulatedProductToOrderInterface[]
  >([]);

  const addItemToOfflineCart = (
    fullProduct: ProductInterface,
    quantity: number
  ): void => {
    let newOfflineCart: OfflinePopulatedCartInterface | null = null;
    const offlineCartLStorageStr: string | null =
      localStorage.getItem("offlineCart");
    if (offlineCartLStorageStr) {
      const offlineCartLStorage: any | null = JSON.parse(
        offlineCartLStorageStr
      );
      if (isCartPopulatedInterface(offlineCartLStorage)) {
        newOfflineCart = pushNewProductOrUpdateQuantityAndReturnObj(
          offlineCartLStorage,
          fullProduct,
          quantity
        );
      } else {
        newOfflineCart = createNewOfflineCartObj(quantity, fullProduct);
      }
    } else {
      newOfflineCart = createNewOfflineCartObj(quantity, fullProduct);
    }
    localStorage.setItem("offlineCart", JSON.stringify(newOfflineCart));
    setCartState(newOfflineCart.products);
  };

  const pushNewProductOrUpdateQuantityAndReturnObj = (
    existingCart: OfflinePopulatedCartInterface,
    fullProduct: ProductInterface,
    quantity: number
  ): OfflinePopulatedCartInterface => {
    const foundIndex = existingCart.products.findIndex(
      (prod) => prod.productId._id === fullProduct._id
    );
    if (foundIndex >= 0) {
      existingCart.products[foundIndex].productId = fullProduct;
      existingCart.products[foundIndex].quantity += quantity;
    } else {
      existingCart.products.push({
        productId: fullProduct,
        quantity,
      });
    }
    const now = new Date();
    existingCart.updatedAt = now.toISOString();
    return existingCart;
  };

  const createNewOfflineCartObj = (
    quantity: number,
    fullProduct: ProductInterface
  ): OfflinePopulatedCartInterface => {
    const now = new Date();
    const isoString = now.toISOString();
    const newOfflineCartObj = {
      products: [{ productId: fullProduct, quantity }],
      updatedAt: isoString,
      createdAt: isoString,
    };
    // localStorage.setItem('offlineCart', JSON.stringify(newOfflineCartObj))
    return newOfflineCartObj;
  };

  const patchNewCart = async (
    newCart: ProductToOrderInterface[]
  ): Promise<boolean> => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const ans = await axios.patch(`${API_URL}/cart`, newCart, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
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

  const updateCart = async (
    id: string,
    quantity: number): Promise<boolean> =>{
      const newCartToSend: PopulatedProductToOrderInterface[] = cartState.map((item) => {
        const newQuantity = item.productId._id === id ? quantity : item.quantity;
        return {
          productId:item.productId,
          quantity: newQuantity,
        };
      });
      if(isLoggedIn){
        return patchOnlineCartAndUpdateState(newCartToSend)
      }else{
        return patchOfflineCartAndUpdateState(newCartToSend)
      }
  }

  const addItemToOnlineCart = async (
    fullProduct: ProductInterface,
    quantity: number
  ): Promise<boolean> => {
    const onlineCartStorageStr: string | null = localStorage.getItem("cart");
    if (onlineCartStorageStr) {
      const onlineCartStorage: cartPopulatedInterface =
        JSON.parse(onlineCartStorageStr);
      if (isCartPopulatedInterface(onlineCartStorage)) {
        const index: number = onlineCartStorage.products.findIndex(
          (product) => product.productId._id === fullProduct._id
        );
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
          cartToPatch.push({ productId: fullProduct._id, quantity: quantity });
          return await patchNewCart(cartToPatch);
        }
      }
      return new Promise((resolve, reject) => reject(false));
    } else {
      return await postNewCart([
        {
          productId: fullProduct._id,
          quantity,
        },
      ]);
    }
  };

  const getOffLineCartOrCleanIfDataIsCorrupted =
    (): OfflinePopulatedCartInterface | null => {
      const offlineCartStr: string | null = localStorage.getItem("offlineCart");
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

  const getOnlineCartAndRecordToStateAndLS = (): Promise<boolean> => {
    return new Promise ( async(resolve, reject)=>{
      try {
        const storedToken = localStorage.getItem("authToken");
        const ans = await axios
          .get(API_URL + "/cart", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
        if (ans.data) {
          localStorage.setItem("cart", JSON.stringify(ans.data));
          setCartState(ans.data.products);
          resolve(true)

        } else {
          localStorage.removeItem("cart");
          setCartState([]);
          resolve(true)
        }
      } catch (error) {
        reject(false)
      }
    })
    
  };

  const patchOnlineCartAndUpdateState = (
    newProdList: PopulatedProductToOrderInterface[]
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const productsToOrderArray: ProductToOrderInterface[] = newProdList.map(
          (prodToOrder) => {
            return {
              productId: prodToOrder.productId._id,
              quantity: prodToOrder.quantity,
            };
          }
        );
        const ans = await axios.patch(API_URL + "/cart", productsToOrderArray, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
        if(ans){
          getOnlineCartAndRecordToStateAndLS();

        }else{
          reject(false)
        }
      } catch (error) {
        reject(false)
      }
    });
  };

  const removeFromCartById = async (id: string): Promise<boolean> => {
    const newCart = cartState.filter(
      (populatedCartList) => populatedCartList.productId._id !== id
    );
    if (isLoggedIn) {
      return await patchOnlineCartAndUpdateState(newCart);
    } else {
      // update offlineCartState && localStorage
      return patchOfflineCartAndUpdateState(newCart);
    }
  };

  const patchOfflineCartAndUpdateState = (
    newProductsArray: PopulatedProductToOrderInterface[]
  ):Promise<boolean> => {
    const offlineCartLSString: string | null =
      localStorage.getItem("offlineCart");
    const offlineCartLS: any = offlineCartLSString
      ? JSON.parse(offlineCartLSString)
      : null;
    if (offlineCartLS && isCartPopulatedInterface(offlineCartLS)) {
      offlineCartLS.products = newProductsArray;
      localStorage.setItem("offlineCart", JSON.stringify(offlineCartLS));
      setCartState(newProductsArray);
      return new Promise((resolve)=>resolve(true))
    }
    return new Promise((resolve,reject)=>reject(false))
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
            resolve(true);
          })
          .catch((err) => {
            reject(false);
          });
      } catch (error) {
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
    fullProduct: ProductInterface,
    quantity: number
  ): Promise<boolean> => {
    if (isLoggedIn) {
      return addItemToOnlineCart(fullProduct, quantity);
    } else {
      addItemToOfflineCart(fullProduct, quantity);
      return new Promise((resolve) => resolve(true));
    }
  };

  const getOfflineCartObjFromLocalStorage = ():OfflinePopulatedCartInterface|null =>{
    const offlineCartSTR:string|null=localStorage.getItem('offlineCart')
    const offlineCartObj:OfflinePopulatedCartInterface|null=offlineCartSTR ? JSON.parse(offlineCartSTR) : null
    if(offlineCartObj && isCartPopulatedInterface(offlineCartObj)){
      return offlineCartObj
    }else{
      //if localStorage is corrupted
      localStorage.removeItem('offlineCart')
      return null
    }
  }

  const getOnlinceCartObjFromLocalStorage = ():PopulatedProductToOrderInterface[]|null =>{
    const onlineCartSTR:string|null=localStorage.getItem('cart')
    const onlineCartObj:PopulatedProductToOrderInterface[]|null=onlineCartSTR ? JSON.parse(onlineCartSTR) : null
    if(onlineCartObj){
      return onlineCartObj
    }else{
      //if localStorage is corrupted
      localStorage.removeItem('cart')
      return null
    }
  }

  const mixCarts=(cart1:PopulatedProductToOrderInterface[], cart2:PopulatedProductToOrderInterface[]):PopulatedProductToOrderInterface[]=>{
    const bigPopulated:PopulatedProductToOrderInterface[] = cart1.concat(cart2)
    const newPopulatedCart:PopulatedProductToOrderInterface[]=[]
    bigPopulated.forEach((populatedProduct:PopulatedProductToOrderInterface)=>{
      const foundIndex:number=newPopulatedCart.findIndex((prod:PopulatedProductToOrderInterface)=>populatedProduct.productId._id===prod.productId._id)
      if(foundIndex>=0){
        newPopulatedCart[foundIndex].quantity+=populatedProduct.quantity
        if(newPopulatedCart[foundIndex].quantity>newPopulatedCart[foundIndex].productId.stockQuantity){
          newPopulatedCart[foundIndex].quantity=newPopulatedCart[foundIndex].productId.stockQuantity
        }
      }else{
        newPopulatedCart.push(populatedProduct)
      }
    })
    localStorage.removeItem('offlineCart')
    return newPopulatedCart
  }

  const getOnlineCartAndMixWithOfflineAndUpdateAndRecordToStateAndLS = async () =>{
    const offlineCartLS:OfflinePopulatedCartInterface|null=getOfflineCartObjFromLocalStorage()
    await getOnlineCartAndRecordToStateAndLS()
    const onlineCartLS:any=getOnlinceCartObjFromLocalStorage()
    if(!onlineCartLS && offlineCartLS ){
      //POST new Cart (offline)
      postNewCart(offlineCartLS.products.map(prod=>{
        return {
          productId:prod.productId._id,
          quantity:prod.quantity
        }
      }))
    }else if(offlineCartLS && onlineCartLS && 'products' in onlineCartLS && isArrayOfProductInterface(onlineCartLS.products)){
      const newCart = mixCarts(offlineCartLS.products,onlineCartLS.products)
      await patchOnlineCartAndUpdateState(newCart)
    }
    

  }

  useEffect(() => {
    if (isLoggedIn) {
      getOnlineCartAndMixWithOfflineAndUpdateAndRecordToStateAndLS()
    } else {
      const offlineClean = getOffLineCartOrCleanIfDataIsCorrupted();
      if (offlineClean && "products" in offlineClean) {
        setCartState(offlineClean.products);
      }
    }
  }, [isLoggedIn]);

  return (
    <CartContext.Provider
      value={{
        addItemToCart,
        productsState,
        setProductsState,
        addItemToOfflineCart,
        cartState,
        removeFromCartById,
        logOutAndEraseStateAndLS,
        updateCart,
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
