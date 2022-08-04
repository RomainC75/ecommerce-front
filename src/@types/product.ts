export interface ProductInterface{
    _id:string,
    brand: string,
    name: string,
    price: number,
    priceType: string,
    stockQuantity: number,
    pictures?: string[],
    caracteristics?: object,
    categories?: string[],
    subCategory: string,
    weight: number,
    originCountry: string,
    createdAt?:string,
    updatedAt?:string
}

export interface ProductToOrderInterface{
    productId:string;
    quantity:number;
}

export interface PopulatedProductToOrderInterface{
    productId:ProductInterface;
    quantity:number;
}



// export interface MatrixContextState{
//     matrix: [number,number][][];
//     temp: number[];
// }


// export type AppContextType = {
//     state: AppContextState ;
//     setState: (state: AppContextState) => void;
//     matrix: MatrixContextState;
//     setMatrix: (state: MatrixContextState) => void;
//     players: PlayersContextState;
//     setPlayers: (state: PlayersContextState) => void;
// };