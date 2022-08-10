export interface UserInterface{
    _id:string;
    email:string;
}

export interface UserExpandedInterface{
    _id:string;
    email:string;
    isMailValidated:string;
    createdAt:string;
    updatedAt:string;
    firstname?:string;
    lastName?:string;
    street1?:string;
    street2?:string;
    city?:string;
    zip?:string;
    state?:string;
    country?:string;
}

export interface NewUserToSend{
    firstname?:string;
    lastName?:string;
    street1?:string;
    street2?:string;
    city?:string;
    zip?:string;
    state?:string;
    country?:string;
}

export interface AuthContextInterface{
    isLoggedIn:boolean;
    isLoading:boolean;
    user:UserInterface | null;
    storeToken: (state:string)=>void;
    authenticateUser:()=>void;
    logOutUser:()=>void;
 
}

