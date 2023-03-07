import { RESET_PRODUCT_REVIEW_COMPONENT } from "./Constants";
const initState = {
  count: 0,
};
const ProductReviewReducer = (state = initState, action) => {
  switch (action.type) {
    case RESET_PRODUCT_REVIEW_COMPONENT: {
      return { ...state, count: state.count + 1 };
    }
    default:
      return state;
  }
};
export default ProductReviewReducer;
