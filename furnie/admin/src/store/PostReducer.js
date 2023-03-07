import * as types from "./Constants";
const initState = {
  create: false,
  updatePost: {
    post: {},
    update: false,
  },
};
const PostReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_POST_UPDATE: {
      return { ...state, updatePost: action.payload };
    }
    case types.GET_POST_CREATE: {
      return { ...state, create: action.payload };
    }
    default:
      return state;
  }
};
export default PostReducer;
