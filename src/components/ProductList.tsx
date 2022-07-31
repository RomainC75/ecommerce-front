import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ProductInterface } from '../@types/product'
import { ProductWidget } from './ProductWidget'

const base_url = "http://localhost:5005"

export const ProductList = ():JSX.Element => {
    const [productArrayState, setProductArrayState] = useState<ProductInterface[]>([])
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(()=>{
    setIsLoading(true)
    axios.get(base_url+'/category/epicerieSalee')
      .then(ans=>{
        setIsLoaded(true)
        setIsLoading(false)
        console.log(ans.data)
        setProductArrayState(ans.data)
      })
  },[])

  return (
    <div>
        <div>ProductList</div>
        <ul>
            {isLoaded && productArrayState.map(product=><ProductWidget key={product.name} product={product}/>)}
        </ul>
    </div>
  )
}
