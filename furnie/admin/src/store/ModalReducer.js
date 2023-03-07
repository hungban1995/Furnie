import * as types from "./Constants";
const initState = { modal: { show: false } };
const ModalReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_MODAL: {
      return { ...state, modal: action.payload };
    }
    default:
      return state;
  }
};
export default ModalReducer;
