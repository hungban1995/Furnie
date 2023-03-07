import * as types from "./Constants";
const initState = {
  userLogin: "",
  updateUser: {
    user: { _id: "", username: "", email: "", role: "", root: false },
    update: false,
  },
};
const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_USER_UPDATE: {
      return { ...state, updateUser: action.payload };
    }
    case types.GET_USER_LOGIN: {
      return { ...state, userLogin: action.payload };
    }
    default:
      return state;
  }
};
export default UserReducer;
