import axios from "axios";
import { useState, useEffect } from "react";
import { ProductWidget } from "./ProductWidget";
import { Spinner } from "./Spinner";
import {
  PaginatedCategoriesInterface,
  ProductInterface,
} from "../@types/product";

import "./style/infiniteScroll.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";
const PAGE_NUMBER = 1;

export const InfiniteScroll = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState(PAGE_NUMBER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("infinite scroll || env : ",process.env.REACT_APP_API_URL)
    if (page > totalPages) return;
    setLoading(true);
    setTimeout(() => {
      axios({
        method: "GET",
        url: `${API_URL}/product/promo`,
        params: {
          page: page,
        },
        //cancelToken: new axios.CancelToken((c:Canceler)=>cancel=c)
      }).then((ans) => {
        console.log("ans : ", ans.data);
        console.log("totalPages received : ", ans.data.totalPages);
        setTotalPages(ans.data.totalPages);
        setProducts((prev) => {
          return [...prev, ...ans.data.data];
        });
        setLoading(false);
      });
    }, 1500);
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => {
        return prev + 1;
      });
    }
  };

  return (
    <div className="InfiniteScroll">
      
      <ul>
        {products.map((product, i) => {
          return <ProductWidget key={"promo" + i} product={product} />;
        })}
      </ul>
      {loading && (page!==totalPages || page===1) && <Spinner/>}
      {/* {error && <div>Error</div>} */}
    </div>
  );
};
