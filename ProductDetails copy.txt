import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductInterface, caracteristicsInterface } from "../@types/product";
import Carousel from "react-material-ui-carousel";
import { Spinner } from "./Spinner";
import { ErrorMessage } from "./ErrorMessage";

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
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  return (
    <div className="ProductDetails">
      {isLoading && <Spinner />}
      {isError && <ErrorMessage message={errorMessage} />}
      {isLoaded && productState && (
        <div className="ProductDetails__container">
          <Carousel className="ProductDetails__container__carroussel">
            {productState?.pictures?.map((item, i) => (
              <img src={item} key={i} />
            ))}
          </Carousel>
          <div className="ProductDetails__container__infos">
            <p className="brand">{productState.brand.toUpperCase()}</p>
            <h2>{productState.name}</h2>
            <ul className="ProductDetails__container__infos__caracteristicsCat">
              {productState.caracteristics &&
                Object.keys(productState.caracteristics).map(
                  (key: string, i) => {
                    const keyCarac =
                      productState.caracteristics &&
                      key in productState.caracteristics &&
                      productState.caracteristics[
                        key as keyof caracteristicsInterface
                      ]
                        ? productState.caracteristics[
                            key as keyof caracteristicsInterface
                          ]
                        : [];
                    return (
                      <li key={`${key}-i`}>
                        <p>{key}</p>
                        <ul className="ProductDetails__container__infos__catElement">
                          {/* <li>{ productState.caracteristics[key][1]}</li> */}
                          {Array.isArray(keyCarac) &&
                            keyCarac.length > 0 &&
                            keyCarac.map((caracEntry, i) => (
                              <li key={`${caracEntry}`}>{caracEntry}</li>
                            ))}
                        </ul>
                      </li>
                    );
                  }
                )}
            </ul>
            <AddProductToBasket product={productState}/>
          </div>
        </div>
      )}
    </div>
  );
};
