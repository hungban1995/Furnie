import * as types from "./Constants";
const initState = { slideImages: [], isEdit: false };
const HomePageManagerReducer = (state = initState, action) => {
  switch (action.type) {
    case types.SET_HOME_SLIDE: {
      return { ...state, slideImages: action.payload };
    }
    case types.SET_IS_EDIT: {
      return { ...state, isEdit: action.payload };
    }
    default:
      return state;
  }
};
export default HomePageManagerReducer;
