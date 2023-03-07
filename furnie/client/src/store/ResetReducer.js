import { GET_ACTIVE, RESET_COMPONENT } from "./Constants";
const initState = {
  count: 0,
  active: false,
};
const ResetReducer = (state = initState, action) => {
  switch (action.type) {
    case RESET_COMPONENT: {
      return { ...state, count: state.count + 1 };
    }
    default:
      return state;
  }
};
export default ResetReducer;
