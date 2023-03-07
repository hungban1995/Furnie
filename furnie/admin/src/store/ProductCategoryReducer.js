import * as types from "./Constants";
const initState = {
  updateCategory: {
    category: {},
    update: false,
  },
};
const ProductCategoryReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_PRODUCT_CATEGORY_UPDATE: {
      return { ...state, updateCategory: action.payload };
    }
    default:
      return state;
  }
};
export default ProductCategoryReducer;
