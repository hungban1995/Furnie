import * as type from "./Constants";
const initState = {
  current_user: {},
};
const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case type.GET_CURRENT_USER: {
      return { ...state, current_user: action.payload };
    }
    default:
      return state;
  }
};
export default UserReducer;
