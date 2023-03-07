import { GET_ORDER_ID } from "./Constants";
const initState = {
  orderId: null,
};
const UserProfileReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_ORDER_ID: {
      return { ...state, orderId: action.payload };
    }
    default:
      return state;
  }
};
export default UserProfileReducer;
