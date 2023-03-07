import * as type from "./Constants";
const initState = {
  order: {},
};
const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case type.GET_ORDER: {
      console.log("GET_ORDER");
      return { ...state, order: action.payload };
    }
    default:
      return state;
  }
};
export default orderReducer;
