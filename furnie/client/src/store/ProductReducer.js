import * as type from "./Constants";
const initState = {
  products: [],
};
const productReducer = (state = initState, action) => {
  switch (action.type) {
    case type.GET_PRODUCT: {
      return { ...state, products: action.payload };
    }
    default:
      return state;
  }
};
export default productReducer;
