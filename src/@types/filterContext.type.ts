export interface FilterInterface{
    price:number[];
    stockQuantity:boolean;
    name:string | null;
    subCategory:string;
}

export interface FilterContextInterface{
    filterState:FilterInterface;
    setFilterState:(state:FilterInterface)=>void;   
    defaultFilter:FilterInterface;
    isFilterActivated:boolean;
    setIsFilterActivated:(state:boolean)=>void;
}