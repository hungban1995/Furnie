import { COMMENT_LIST } from "./Constants";
const initState = {
  commentList: [],
};
const ListComments = (state = initState, action) => {
  switch (action.type) {
    case COMMENT_LIST: {
      return { ...state, commentList: action.payload };
    }
    default:
      return state;
  }
};
export default ListComments;
