import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { ProductInterface } from "../@types/product";
import { ProductWidget } from "../components/ProductWidget";
import { FilterContext } from "../context/filter.context";
import Pagination from "@mui/material/Pagination";
import { Spinner } from "../components/Spinner";
import { FilterContextInterface } from "../@types/filterContext.type";
import { FilterComp } from "../components/FilterComp";

import {categoriesTranslator} from '../tools/categories'
import "./style/productsList.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

interface ProductListInterface {
  cat?: string;
}

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ProductsList = (props: ProductListInterface): JSX.Element => {
  const q = useQuery();
  let page = q.get("page") ? q.get("page") : "1";
  const translatedCategory = categoriesTranslator.find((val)=>val[1]===props.cat)
  const [pageState, setPageState] = useState(page ? parseInt(page) : 1);
  const { filterState, isFilterActivated } = useContext(FilterContext) as FilterContextInterface;
  
  const navigate = useNavigate();
  const [productArrayState, setProductArrayState] = useState<
    ProductInterface[]
  >([]);
  const [subCategoriesState, setSubCategoriesState] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(0);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number):void => {
    const searchP:any = {
      page: value.toString(),
    };
    console.log("page value", value);
    if (isFilterActivated){
        searchP.subCat=filterState.subCategory
        searchP.minPrice=filterState.price[0].toString()
        searchP.maxPrice=filterState.price[1].toString()
    }
    navigate({
      pathname: `/category/${props.cat}`,
      search: createSearchParams(searchP).toString(),
    });
    setPageState(value);
  };

  useEffect(()=>{
    setIsLoading(true);
    console.log('===========',pageState,'===========',filterState)
    let url=""
    if (isFilterActivated) {
      url = window.location.href
      .split("/")
      .filter((val, i) => i >= 3)
      .join("/");
      console.log('temp',url)
      url = API_URL + "/product/" + url
    }else{
      console.log('non activé')
      url = props.cat
        ? API_URL + `/product/category/${props.cat}` + "?page=" + pageState
        : API_URL + "/product/";
    }
    axios
      .get(url)
      .then((ans) => {
        setIsLoaded(true);
        setIsLoading(false);
        setProductArrayState(ans.data.data);
        setMaxPageNumber(ans.data.totalPages);
        setSubCategoriesState(ans.data.subCategories);
        setPageState(ans.data.page)
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error : ", err);
      });
  },[pageState,filterState])


  return (
    <div className="ProductsList">
      <h2>ProductList</h2>
      <h3>Catégorie : { translatedCategory ? translatedCategory[0] : props.cat }</h3>
      <p>You can filter depending on the <strong>subCategory</strong> and the <strong>price</strong> : </p>
      <FilterComp cat={props.cat} subCategories={subCategoriesState} />
      <Pagination
        count={maxPageNumber}
        page={pageState}
        onChange={handlePage}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="ProductsList__ul">
          {isLoaded &&
            productArrayState.map((product) => (
              <ProductWidget key={product.name} product={product} />
            ))}
        </ul>
      )}
    </div>
  );
};
