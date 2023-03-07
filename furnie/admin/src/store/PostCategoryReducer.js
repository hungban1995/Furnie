import * as types from "./Constants";
const initState = {
  create: false,
  updatePostCategory: {
    category: {},
    update: false,
  },
};
const PostCategoryReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_POST_CATEGORY_UPDATE: {
      return { ...state, updatePostCategory: action.payload };
    }
    case types.GET_POST_CATEGORY_CREATE: {
      return { ...state, create: action.payload };
    }
    default:
      return state;
  }
};
export default PostCategoryReducer;
