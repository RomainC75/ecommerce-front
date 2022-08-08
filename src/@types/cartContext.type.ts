import { ProductToOrderInterface, PopulatedProductToOrderInterface, ProductInterface } from "./product"

//localStorage : cartPopulatedInterface !!!!!

export interface cartInterface{
    _id:string;
    products: ProductToOrderInterface[];
    createdAt: string;
    updatedAt: string;
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
}