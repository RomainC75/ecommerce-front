import React, { useContext } from "react";
import { AddProductToBasket } from "./AddProductToBasket";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import { ProductInterface } from "../@types/product";

import "./style/productWidget.css";
import { Link } from "react-router-dom";
import {AiOutlineWarning} from 'react-icons/ai'

interface ProductProps {
  product: ProductInterface;
  ref?:Function;
}

const fillInPicture =
  "https://img2.freepng.fr/20180615/fjw/kisspng-royalty-free-clip-art-bio-5b23ee2e74f274.805270871529081390479.jpg";

  const pricePerQty = (product:ProductInterface) =>{
    const proportion = product.price/product.weight.quantity
    switch(product.weight.unity){
      case 'g':
        return (proportion/1000).toFixed(2)+'kg'
      case 'kg':
        return proportion.toFixed(2)+'kg'
      case 'cl':
        return proportion.toFixed(2)+'cl'
    }
  } 

export const ProductWidget = (props: ProductProps): JSX.Element => {
  
  const { product } = props;

  const { addItemToOfflineCart, addItemToOnlineCart } = useContext(
    CartContext
  ) as cartContextInterface;
  // console.log('Price : ',product.price, product.weight)

  return (
    <li className="ProductWidget">
      <Link className="ProductWidget__link" to={`/product/${product._id}`}>
        <p className="ProductWidget__infos brand">{product.brand.toUpperCase()}</p>
        <h3 className="ProductWidget__infos name">{product.name}</h3>
        <div className="ProductWidget__infos picture">
          {"promo" in product && <div className="promo"><AiOutlineWarning className="ProductWidget__infos picture promo"/></div>}
          {product.pictures ? (
            <img src={product.pictures[0]} />
          ) : (
            <img src={fillInPicture} />
          )}
        </div>
      </Link>
      <div className="ProductWidget__infos price">
        <p>Price : <span className={'promo' in product ? 'overline' : ''}>{product.price}</span>€</p>
        {'promo' in product && <div className="promo">
          <p className="promorate">{product.promo}%  =</p>
          <p className="newPrice">{(product.price - product.price*(product.promo ? product.promo : 0)/100).toFixed(2)}€</p>
          </div>}
        {product.weight && <p>({(product.price *1000 / product.weight.quantity).toFixed(2)}/kg)</p>}

        <AddProductToBasket product={product}/>
      </div>
    </li>
  );
};
