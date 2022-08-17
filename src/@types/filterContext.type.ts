export interface FilterInterface{
    price:number[];
    stockQuantity:boolean;
    name:string | null;
    category:string;
}

export interface FilterContextInterface{
    filterState:FilterInterface;
    setFilterState:(state:FilterInterface)=>void;   
}