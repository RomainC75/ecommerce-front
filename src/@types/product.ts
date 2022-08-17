

// export interface caracteristicsInterface {
//     ingredients?:string[];
//     "valeur nutritionnelles pour 100g"?:string[];
//     caractéristiques?:string[];
// }

interface weight{
    quantity:number;
    unity:'kg'|'g'|'cl'
}

export interface ProductInterface{
    _id:string,
    brand: string,
    name: string,
    price: number,
    priceType: string,
    stockQuantity: number,
    pictures?: string[],
    caracteristics?: string[],
    categories: string[],
    subCategory?: string,
    weight: weight,
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