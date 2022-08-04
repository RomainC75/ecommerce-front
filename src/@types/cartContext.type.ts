import { ProductToOrderInterface } from "./product"

export interface cartInterface{
    _id:string;
    products: ProductToOrderInterface[];
    createdAt: string;
    updatedAt: string;
}

export interface cartContextInterface{
    productsState: cartInterface | null;
    setProductsState: (state:cartInterface)=>void;
    addItemToOfflineCart: (item:ProductToOrderInterface)=>void;
    getItemsFromOffLineCart: ()=>ProductToOrderInterface[];
    offlineCartState: ProductToOrderInterface[];
}