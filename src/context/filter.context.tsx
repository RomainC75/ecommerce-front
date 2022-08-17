import React, { useState, useEffect, createContext, ReactNode, PropsWithChildren } from "react";
import axios from "axios";
import { AuthContextInterface, UserInterface } from "../@types/authContext.type";
import { Navigate, useNavigate } from "react-router-dom";
import { FilterContextInterface, FilterInterface } from "../@types/filterContext.type";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const FilterContext = createContext<FilterContextInterface | null>(null);

const defaultFilter:FilterInterface={
  price:[0,1000],
  stockQuantity:false,
  name:"",
  category:"All"
}

function FilterProviderWrapper(props:PropsWithChildren<{}>) {
  const [filterState, setFilterState] = useState<FilterInterface>(defaultFilter)
  return (
    <FilterContext.Provider value={{ filterState, setFilterState }}>
      {props.children}
    </FilterContext.Provider>
  );
}

export { FilterContext, FilterProviderWrapper };
