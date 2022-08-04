export interface UserInterface{
    _id:string;
    email:string;
}

export interface AuthContextInterface{
    isLoggedIn:boolean;
    isLoading:boolean;
    user:UserInterface | null;
    storeToken: (state:string)=>void;
    authenticateUser:()=>void;
    logOutUser:()=>void;
 
}

