import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { ProductInterface } from '../@types/product'
import Carousel from 'react-material-ui-carousel'
import { Spinner } from './Spinner'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const ProductDetails = ():JSX.Element => {
    const [productState, setProductsState] = useState<ProductInterface | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isError, setIsError ] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const {productId} = useParams()

    useEffect(()=>{
      setIsLoading(true)
      axios.get(`${API_URL}/product/${productId}`)
      .then(ans=>{
        setIsLoaded(true)
        setIsLoading(false)
        setProductsState(ans.data)
      })
      .catch(err=>{
        setIsLoading(false)
        setIsError(true)
        setErrorMessage(err.response.data.message)
      })
    },[])

  return (
    <div className="ProductDetails">
      <Spinner/>
      {isLoading && <Spinner/>}
        <Carousel>{productState?.pictures?.map((item,i)=><img src={item} key={i}/>)}</Carousel>
    </div>
  )
}
