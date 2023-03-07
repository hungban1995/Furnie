import { POST_CATEGORY } from "./Constants";
const initState = {
  category: {},
};
const PostCategory = (state = initState, action) => {
  switch (action.type) {
    case POST_CATEGORY: {
      return { ...state, category: action.payload };
    }
    default:
      return state;
  }
};
export default PostCategory;
