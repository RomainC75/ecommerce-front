import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductInterface } from "../@types/product";
import Carousel from "react-material-ui-carousel";
import { Spinner } from "./Spinner";
import { ErrorMessage } from "./ErrorMessage";
import MakeTextPrettier from "./MakeTextPrettier";
import "./style/productDetails.css";
import { AddProductToBasket } from "./AddProductToBasket";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";



export const ProductDetails = (): JSX.Element => {
  const [productState, setProductsState] = useState<ProductInterface | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { productId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/product/${productId}`)
      .then((ans) => {
        setIsLoaded(true);
        setIsLoading(false);
        setProductsState(ans.data);
        console.log(ans.data)
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  return (
    <div className="ProductDetails">
      <h2>THIS PRESENTATION IS TEMPORARY !!</h2>
      {isLoading && <Spinner />}
      {isError && <ErrorMessage message={errorMessage} />}
      {isLoaded && productState && (
        <div className="ProductDetails__container">
          <div className="ProductDetails__container__left">
            <Carousel className="ProductDetails__container__left__carroussel">
              {productState?.pictures?.map((item, i) => (
                <img src={item} key={i} />
              ))}
            </Carousel>
            <ul className="ProductDetails__container__left__caracteristicsCat">
              {productState.caracteristics && productState.caracteristics.map((line:string,index)=>
                <li key={`${index}-${line}`}>{<MakeTextPrettier text={line}/>}<p></p></li>
              )}
            </ul>
          </div>
          <div className="ProductDetails__container__infos">
            <p className="brand">{productState.brand.toUpperCase()}</p>
            <h2>{productState.name}</h2>
            <AddProductToBasket product={productState}/>
            
          </div>
        </div>
      )}
    </div>
  );
};
