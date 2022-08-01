import React from 'react'
import { ProductInterface } from '../@types/product'

import './style/productWidget.css'

interface ProductProps{
    product:ProductInterface;
}

const fillInPicture = "https://img2.freepng.fr/20180615/fjw/kisspng-royalty-free-clip-art-bio-5b23ee2e74f274.805270871529081390479.jpg"

export const ProductWidget = (props:ProductProps):JSX.Element => {
    const {product} = props
  return (
    <div className="ProductWidget">
      <p className="ProductWidget__infos">{product.brand}</p>
      <h3 className="ProductWidget__infos">{product.name}</h3>
      <div className="ProductWidget__picture">
        {product.pictures ?
          <img src={product.pictures[0]}/>
        :
          <img src={fillInPicture}/>
          }
      </div>
      <div className="ProductWidget__infos">
        <p>{product.price}€</p>
        {product.weight && <p>{product.price/product.weight}</p>}
      </div>
    </div>
  )
}