import axios from 'axios'
import React,{useState} from 'react'
import { useParams } from 'react-router-dom'
import { ProductInterface } from '../@types/product'
import Carousel from 'react-material-ui-carousel'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export const ProductDetails = () => {
    const [productState, setProductsState] = useState<ProductInterface | null>(null)

    const {productId} = useParams()

    axios.get(`${API_URL}/product/${productId}`)
    .then(ans=>setProductsState(ans.data))
  return (
    <div className="ProductDetails">
        <Carousel>{productState?.pictures?.map((item,i)=><img src={item} key={i}/>)}</Carousel>
    </div>
  )
}
