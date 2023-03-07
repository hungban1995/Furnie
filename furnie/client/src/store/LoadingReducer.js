import { GET_LOADING } from "./Constants";
const initState = {
  loading: false,
};
const LoadingReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_LOADING: {
      return { ...state, loading: action.payload };
    }
    default:
      return state;
  }
};
export default LoadingReducer;
