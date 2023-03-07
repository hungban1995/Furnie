import * as types from "./Constants";
const initState = 0;
const CounterReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_COUNT: {
      return state + 1;
    }
    default:
      return state;
  }
};
export default CounterReducer;
