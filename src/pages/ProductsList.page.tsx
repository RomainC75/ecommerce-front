import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ProductInterface } from '../@types/product'
import { ProductWidget } from '../components/ProductWidget'
import { FilterContext } from '../context/filter.context'

import { FilterContextInterface } from '../@types/filterContext.type'

import './style/productsList.css'
import { Filter } from '../components/Filter'

const base_url = "http://localhost:5005"

export const ProductsList = ():JSX.Element => {
  const [productArrayState, setProductArrayState] = useState<ProductInterface[]>([])
  const { filterState } = useContext(
    FilterContext
  ) as FilterContextInterface;

  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(()=>{
    setIsLoading(true)
    axios.get(base_url+'/product/')
      .then(ans=>{
        setIsLoaded(true)
        setIsLoading(false)
        console.log('-->RECEIVED : ',ans.data)
        setProductArrayState(ans.data)
        // console.log(ans.data.map(data.))
      })
  },[])

  return (
    <div className="ProductsList">
        <h2>ProductList</h2>
        <Filter/>
        <ul className="ProductsList">
            {isLoaded && productArrayState.filter(prod=>{
              return filterState.category!='All' ? prod.categories.includes(filterState.category) : true
            }).filter(prod=>prod.price>=filterState.price[0] && prod.price<=filterState.price[1])
            .map(product=><ProductWidget key={product.name} product={product}/>)}
        </ul>
    </div>
  )
}
