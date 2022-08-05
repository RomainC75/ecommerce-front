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
  if (
    !("productId" in obj) ||
    !("quantity" in obj) ||
    typeof obj.productId !== "object" ||
    typeof obj.quantity !== "number"
  ) {
    return false;
  }
  const pId = obj.productId;
  if (
    "_id" in pId &&
    "brand" in pId &&
    "name" in pId &&
    "price" in pId &&
    "priceType" in pId &&
    "stockQuantity" in pId &&
    "pictures" in pId &&
    "subCategory" in pId &&
    "weight" in pId &&
    "originCountry" in pId
  ) {
    if (
      typeof pId._id === "string" &&
      typeof pId.brand === "string" &&
      typeof pId.name === "string" &&
      typeof pId.price === "number" &&
      typeof pId.priceType === "string" &&
      typeof pId.stockQuantity === "number" &&
      typeof pId.subCategory === "string" &&
      typeof pId.weight === "number" &&
      typeof pId.originCountry === "string"
    ) {
      return true;
    }
  }
  return false;
};

const isArrayOfProductInterface = (array: any): boolean => {
  return (
    Array.isArray(array) && array.every((prod) => isProductInterface(prod))
  );
};

export const isCartPopulatedInterface = (obj: any): boolean => {
  if (
    typeof obj === "object" &&
    "products" in obj &&
    "createdAt" in obj &&
    "updatedAt" in obj
  ) {
    if (
      isArrayOfProductInterface(obj.products) &&
      typeof obj.createdAt === "string" &&
      typeof obj.updatedAt === "string"
    )
      return true;
  }
  return false;
};
