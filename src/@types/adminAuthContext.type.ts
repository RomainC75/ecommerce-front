export interface AdminInterface{
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

export interface AdminAuthContextInterface{
    isAdminLoggedIn:boolean;
    isLoading:boolean;
    admin:AdminInterface | null;
    storeToken: (state:string)=>void;
    authenticateAdmin:()=>void;
    logOutAdmin:()=>void; 
}

