import * as types from "./Constants";
const initState = {
  updateProduct: {
    product: {},
    update: false,
  },
};
const ProductCategoryReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_PRODUCT_UPDATE: {
      return { ...state, updateProduct: action.payload };
    }
    default:
      return state;
  }
};
export default ProductCategoryReducer;
