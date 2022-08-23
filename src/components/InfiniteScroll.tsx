import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { ProductWidget } from './ProductWidget';

import {PaginatedCategoriesInterface, ProductInterface} from "../@types/product"

import './style/infiniteScroll.css'

const base_url = "http://localhost:5005";

export const InfiniteScroll = () => {
    const [ productsState, setProductsState] = useState<PaginatedCategoriesInterface | null >(null)
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(0);
    const [pageState, setPageState] = useState<number>(1)

  useEffect(()=>{
    setIsLoading(true)
    axios.get(`${base_url}/product/promo?page=${pageState}`)
        .then(ans=>{
          setIsLoading(false)
          setIsLoaded(true)
          setProductsState(ans.data)
          console.log('res : ',ans.data)
        })
        .catch(err=>{
          setIsLoading(false)
        })
  },[])
  return (
    <div className='InfiniteScroll'>
      {
        isLoaded && productsState && productsState.data.map((product,i)=><ProductWidget key={"promo"+i} product={product}/>)
      }
    </div>
  )
}
