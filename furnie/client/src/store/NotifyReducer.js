import { GET_NOTIFY } from "./Constants";
const initState = {
  notify: {},
};
const NotifyReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_NOTIFY: {
      return { ...state, notify: action.payload };
    }
    default:
      return state;
  }
};
export default NotifyReducer;
