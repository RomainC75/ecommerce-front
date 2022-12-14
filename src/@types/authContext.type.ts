export interface UserInterface{
    _id:string;
    email:string;
    imageUrl:string;
}

export interface UserExpandedInterface{
    _id:string;
    email:string;
    isMailValidated:string;
    createdAt:string;
    updatedAt:string;
    firstname?:string;
    lastname?:string;
    street1?:string;
    street2?:string;
    city?:string;
    zip?:string;
    state?:string;
    country?:string;
    birthdate?:string;
    imageUrl?:string;
}

export interface NewUserToSend{
    firstname?:string;
    lastname?:string;
    street1?:string;
    street2?:string;
    city?:string;
    zip?:string;
    state?:string;
    country?:string;
    birthdate?:string;
}



export interface AuthContextInterface{
    isLoggedIn:boolean;
    isLoading:boolean;
    user:UserInterface | null;
    storeToken: (state:string)=>void;
    authenticateUser:()=>void;
    logOutUser:()=>void;
 
}

