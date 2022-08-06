import React,{useState, useContext} from 'react'
import {ProductInterface} from '../@types/product'
import { CartContext } from "../context/cart.context";
import { PopulatedProductToOrderInterface } from '../@types/product';
import { cartContextInterface } from "../@types/cartContext.type";

interface ProductProps {
    product: ProductInterface;
  }

const getQuantityAlreadyInBasket = (cartState:PopulatedProductToOrderInterface[],currentProduct:ProductInterface) =>{
  const productInBasket = cartState.find(populatedProd=>populatedProd.productId._id===currentProduct._id)
  if(productInBasket){
    return productInBasket.quantity
  }
  return 0
}

export const AddProductToBasket = (props: ProductProps):JSX.Element => {
  const {product}=props
  const [ quantityState, setQuantityState ] = useState<number>(0)
    const { addItemToOfflineCart, addItemToOnlineCart, cartState } = useContext(
        CartContext
      ) as cartContextInterface;

      let quantityInBasket=getQuantityAlreadyInBasket(cartState, product)

    
  const handleQuantity = (num:number) =>{
    console.log(product, quantityInBasket)
    const maxPossibleQuantityToAdd = product.stockQuantity-quantityInBasket 
    if(num>=0 && num<=maxPossibleQuantityToAdd ){
      setQuantityState(num)
    }
  }

  return (
    <div className="AddProductToBasktet">
      <label htmlFor='quantity'>Quantity</label>
      <input value={quantityState} type="number" onChange={(el)=>handleQuantity(parseInt(el.target.value))}/>
      
    </div>
  )
}
