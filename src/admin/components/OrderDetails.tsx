import React from 'react'
import { PopulatedProductToOrderInterface } from '../../@types/product';

import './style/orderDetails.css'

interface OrderDetailsInterface{
    product:PopulatedProductToOrderInterface;
    orderId:string;
}

export const OrderDetails = (props:OrderDetailsInterface): JSX.Element => {
    
  return (
    <li className="OrderDetails">
        <div className="OrderDetails__left">
            <img src={props.product.productId.pictures?props.product.productId.pictures[0]:''}></img>
            <div className="OrderDetails__left__data">
                <p>{props.product.productId.name}</p>
                <p>{props.product.productId.category}</p>
                <ul className="OrderDetails__left__data__subCat">
                    {props.product.productId.subCategories.map(subCat=><li key={`${props.orderId}-${props.product.productId._id}-${subCat}`}>{subCat}</li>)}
                </ul>
            </div>
        </div>
        <div className="OrderDetails__right">
            <p>Quantity :</p>
            <p>{props.product.quantity}</p>
        </div>
    </li>
  )
}
