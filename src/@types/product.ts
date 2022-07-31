export interface ProductInterface{
    brand: string,
    name: string,
    price: number,
    priceType: string,
    stockQuantity: number,
    pictures?: string[],
    caracteristics?: object,
    categories?: string[],
    subCategory: string,
    weight?: number
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