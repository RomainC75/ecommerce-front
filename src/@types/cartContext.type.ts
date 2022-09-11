import { ProductToOrderInterface, PopulatedProductToOrderInterface, ProductInterface } from "./product"
import { DestinationAddressInterface } from "./destinationAddress.type";
//localStorage : cartPopulatedInterface !!!!!

export interface cartInterface{
    _id:string;
    products: ProductToOrderInterface[];
    createdAt: string;
    updatedAt: string;
}

interface CreditCardInterface{
    cardNumber:string;
    cvcNumber:string;
    name:string
}

export interface CartToOrderInterface{
    totalCost:number
    creditCard:CreditCardInterface;
    address:DestinationAddressInterface;
}

export interface cartPopulatedInterface{
    _id:string;
    products: PopulatedProductToOrderInterface[];
    createdAt: string;
    updatedAt: string;
}

export interface cartContextInterface{
    productsState: ProductToOrderInterface[] | null;
    setProductsState: (state:ProductToOrderInterface[])=>void;
    addItemToOfflineCart: (item:ProductToOrderInterface)=>void;
    getItemsFromOffLineCart: ()=>ProductToOrderInterface[];
    offlineCartState: ProductToOrderInterface[];
    cartState: PopulatedProductToOrderInterface[];
    removeFromCartById: (id:string)=>void;
    addItemToOnlineCart: (itemId:string, quantity:number, product:ProductInterface)=>void;
    logOutAndEraseStateAndLS:()=>void;
    updateQuantityOnOneItemAndPatch:(id:string,quantity:number)=>Promise<boolean>;
    getTotal:()=>string;
    getNewPromoPrice:(basePrice:number, promo:number)=>number;
    validateCartWithCreditCard:(infos:CartToOrderInterface)=>Promise<boolean>;
    getOnlineCartAndRecordToStateAndLS:()=>void;

    

}