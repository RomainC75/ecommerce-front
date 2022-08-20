export interface FilterInterface{
    price:number[];
    stockQuantity:boolean;
    name:string | null;
    subCategory:string;
    activated:boolean;
}

export interface FilterContextInterface{
    filterState:FilterInterface;
    setFilterState:(state:FilterInterface)=>void;   
    defaultFilter:FilterInterface;
}