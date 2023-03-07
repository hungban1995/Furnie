import * as type from "./Constants";
const initState = {
  active: false,
};
const active_background_reducer = (state = initState, action) => {
  switch (action.type) {
    case type.ACTIVE_ACTIVE_BACKGROUND: {
      return { ...state, active: !state.active };
    }
    default:
      return state;
  }
};
export default active_background_reducer;
