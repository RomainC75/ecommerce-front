import { useState, createContext, PropsWithChildren } from "react";

import { FilterContextInterface, FilterInterface } from "../@types/filterContext.type";

const FilterContext = createContext<FilterContextInterface | null>(null);

const defaultFilter:FilterInterface={
  price:[0,1000],
  stockQuantity:false,
  name:"",
  subCategory:"All",
}

function FilterProviderWrapper(props:PropsWithChildren<{}>) {
  const [filterState, setFilterState] = useState<FilterInterface>(defaultFilter)
  const [isFilterActivated, setIsFilterActivated] = useState<boolean>(false)
  return (
    <FilterContext.Provider value={{ filterState, setFilterState, defaultFilter, isFilterActivated, setIsFilterActivated }}>
      {props.children}
    </FilterContext.Provider>
  );
}

export { FilterContext, FilterProviderWrapper };
