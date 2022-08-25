import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { ProductWidget } from "./ProductWidget";
import { Spinner } from "./Spinner";
import {
  PaginatedCategoriesInterface,
  ProductInterface,
} from "../@types/product";

import "./style/infiniteScroll.css";

const base_url = "http://localhost:5005";
const PAGE_NUMBER = 1;

// function isBottom(ref: React.RefObject<HTMLUListElement>) {
//   if (!ref.current) {
//     return false;
//   }
//   return ref.current.getBoundingClientRect().bottom <= window.innerHeight;
// }

export const InfiniteScroll = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState(PAGE_NUMBER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page > totalPages) return;
    setLoading(true);
    setTimeout(() => {
      axios({
        method: "GET",
        url: `${base_url}/product/promo`,
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
      {loading && page!==totalPages && <Spinner/>}
      {/* {error && <div>Error</div>} */}
    </div>
  );
};
