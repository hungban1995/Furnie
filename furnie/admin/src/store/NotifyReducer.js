import * as types from "./Constants";
const initState = { notify: { show: false } };
const NotifyReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_NOTIFY: {
      return { ...state, notify: action.payload };
    }
    default:
      return state;
  }
};
export default NotifyReducer;
