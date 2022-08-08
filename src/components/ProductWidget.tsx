import React, { useContext } from "react";
import { AddProductToBasket } from "./AddProductToBasket";

import { CartContext } from "../context/cart.context";
import { cartContextInterface } from "../@types/cartContext.type";
import { ProductInterface } from "../@types/product";

import "./style/productWidget.css";
import { Link } from "react-router-dom";

interface ProductProps {
  product: ProductInterface;
}

const fillInPicture =
  "https://img2.freepng.fr/20180615/fjw/kisspng-royalty-free-clip-art-bio-5b23ee2e74f274.805270871529081390479.jpg";

export const ProductWidget = (props: ProductProps): JSX.Element => {
  
  const { product } = props;

  const { addItemToOfflineCart, addItemToOnlineCart } = useContext(
    CartContext
  ) as cartContextInterface;

  return (
    <div className="ProductWidget">
      <Link to={`/product/${product._id}`}>
        <p className="ProductWidget__infos brand">{product.brand.toUpperCase()}</p>
        <h3 className="ProductWidget__infos name">{product.name}</h3>
        <div className="ProductWidget__infos picture">
          {product.pictures ? (
            <img src={product.pictures[0]} />
          ) : (
            <img src={fillInPicture} />
          )}
        </div>
      </Link>
      <div className="ProductWidget__infos">
        <p>{product.price}€</p>
        {product.weight && <p>{product.price / product.weight}</p>}
        <AddProductToBasket product={product}/>
      </div>
    </div>
  );
};
