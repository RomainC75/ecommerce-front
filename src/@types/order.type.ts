import {PopulatedProductToOrderInterface} from '../@types/product'
import { AddressInterface } from '../@types/user';

export interface OrderInterface{
    _id:string;
    userId:string;
    payementStatus:"paid"|"shipped"|"received";
    totalCost: number;
    products: [PopulatedProductToOrderInterface]
    shipping: {
        address: AddressInterface
    }
    createdAt: string;
    updatedAt: string;
}

