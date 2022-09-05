

// export interface caracteristicsInterface {
//     ingredients?:string[];
//     "valeur nutritionnelles pour 100g"?:string[];
//     caractéristiques?:string[];
// }

interface weight{
    quantity:number;
    unity:'g'|'kg'|'cl'|'ml'|'l'|'m²'
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
    category: string,
    subCategories: string[],
    weight: weight,
    createdAt?:string,
    updatedAt?:string,
    promo?:number;
}

export interface ProductToOrderInterface{
    productId:string;
    quantity:number;
}

export interface PopulatedProductToOrderInterface{
    productId:ProductInterface;
    quantity:number;
}

export interface PaginatedCategoriesInterface{
    data:ProductInterface[];
    page:number;
    total:number;
    totalPages:number;
    subCategories:string[];
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