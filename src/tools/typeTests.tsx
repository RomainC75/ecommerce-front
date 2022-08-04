export const isProductToOrderInterface = (obj:any):boolean =>{
    console.log(obj)
    const keys = Object.keys(obj)
    if(keys.includes('productId') && keys.includes('quantity') && keys.length===2){
        if(typeof obj.productId === 'string' && typeof obj.quantity === 'number'){
            return true
        }
    }
    return false
}

export const isProductToOrderInterfaceArray = (array:any):boolean =>{
    if(!Array.isArray(array)){
        return false
    }
    return array.every(val=>isProductToOrderInterface(val))
}