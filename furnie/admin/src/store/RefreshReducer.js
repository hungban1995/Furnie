import * as types from "./Constants";
const initState = { num: 0 };
const RefreshReducer = (state = initState, action) => {
  switch (action.type) {
    case types.SET_REFRESH: {
      return { ...state, num: state.num + 1 };
    }
    default:
      return state;
  }
};
export default RefreshReducer;
