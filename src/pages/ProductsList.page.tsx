import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useLocation, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { ProductInterface } from '../@types/product'
import { ProductWidget } from '../components/ProductWidget'
import { FilterContext } from '../context/filter.context'
import Pagination from '@mui/material/Pagination';

import { FilterContextInterface } from '../@types/filterContext.type'
import { PaginatedCategoriesInterface } from '../@types/product'

import './style/productsList.css'
import { Filter } from '../components/Filter'
import { Menu } from '../components/Menu'

const base_url = "http://localhost:5005"

interface ProductListInterface {
  cat?:string;
}

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ProductsList = (props:ProductListInterface):JSX.Element => {
  const q=useQuery()
  let page = q.get('page') ? q.get('page') : '1'
  console.log('rerender ? ')
  const navigate = useNavigate()

  const [pageState, setPageState] = useState(page ? parseInt(page) : 1)
  const [productArrayState, setProductArrayState] = useState<ProductInterface[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [maxPageNumber, setMaxPageNumber] = useState<number>(0)
  const { filterState } = useContext(
    FilterContext
  ) as FilterContextInterface;

  
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log('page value',value)
    navigate({
      pathname:`/category/epicerie-salee`,
      search:createSearchParams({
        page:value.toString()
      }).toString()
    })
    setPageState(value)
  };

  useEffect(()=>{
    setIsLoading(true)
    const requestUrl = props.cat ? base_url+`/product/${'category/'+props.cat}`+'?page='+page : base_url+'/product/'
    console.log('REQUEST URL : ',requestUrl)
    axios.get(requestUrl)
      .then((ans)=>{
        setIsLoaded(true)
        setIsLoading(false)
        // console.log('-->RECEIVED : ',ans.data)
        setProductArrayState(ans.data.data)
        setMaxPageNumber(ans.data.totalPages)
        // console.log(ans.data.map(data.))
      })
  },[pageState])

  return (
    <div className="ProductsList">
        
        <h2>ProductList</h2>
        <Filter/>
        <p>{1}</p>
        <Pagination count={maxPageNumber} page={pageState} onChange={handleChange} />
        <ul className="ProductsList">
            {isLoaded && productArrayState.filter(prod=>{
              return filterState.category!='All' ? prod.categories.includes(filterState.category) : true
            }).filter(prod=>prod.price>=filterState.price[0] && prod.price<=filterState.price[1])
            .map(product=><ProductWidget key={product.name} product={product}/>)}
        </ul>
    </div>
  )
}
