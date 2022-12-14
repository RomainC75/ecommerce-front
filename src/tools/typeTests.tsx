export const isProductToOrderInterface = (obj: any): boolean => {
  console.log(obj);
  const keys = Object.keys(obj);
  if (
    keys.includes("productId") &&
    keys.includes("quantity") &&
    keys.length === 2
  ) {
    if (typeof obj.productId === "string" && typeof obj.quantity === "number") {
      return true;
    }
  }
  return false;
};

export const isProductToOrderInterfaceArray = (array: any): boolean => {
  if (!Array.isArray(array)) {
    return false;
  }
  return array.every((val) => isProductToOrderInterface(val));
};

const isProductInterface = (obj: any): boolean => {
  console.log("===>test 1 ")
  if (
    !("productId" in obj) ||
    !("quantity" in obj) ||
    typeof obj.productId !== "object" ||
    typeof obj.quantity !== "number"
  ) {
    return false;
  }
  const pId = obj.productId;
  console.log('==>test 2')
  if (
    "_id" in pId &&
    "brand" in pId &&
    "name" in pId &&
    "price" in pId &&
    "priceType" in pId &&
    "stockQuantity" in pId &&
    "pictures" in pId &&
    "category" in pId &&
    "subCategories" in pId &&
    "weight" in pId 
  ) {
    console.log("==>test 3")
    if (
      typeof pId._id === "string" &&
      typeof pId.brand === "string" &&
      typeof pId.name === "string" &&
      typeof pId.price === "number" &&
      typeof pId.priceType === "string" &&
      typeof pId.stockQuantity === "number" &&
      Array.isArray(pId.pictures) &&
      typeof pId.category === "string" &&
      Array.isArray(pId.subCategories) &&
      typeof pId.weight === "object"
    ) {
      console.log('isProductInterface test : passed ')
      return true;
    }
  }
  return false;
};

export const isArrayOfProductInterface = (array: any): boolean => {
  console.log('inside : ',array)
  if(Array.isArray(array) && array.length===0) {
    return true
  }
  return (
    Array.isArray(array) && array.every((prod) => isProductInterface(prod))
  );
};

export const isCartPopulatedInterface = (obj: any): boolean => {
  console.log('TEST : isCartPopulated')
  if (
    typeof obj === "object" &&
    "products" in obj &&
    "createdAt" in obj &&
    "updatedAt" in obj
  ) {
    console.log("===>test 0")
    if (
      isArrayOfProductInterface(obj.products) &&
      typeof obj.createdAt === "string" &&
      typeof obj.updatedAt === "string"
    )
      return true;
  }
  return false;
};
