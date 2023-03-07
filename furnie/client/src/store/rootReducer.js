import { combineReducers } from "redux";
import productReducer from "./ProductReducer";
import NotifyReducer from "./NotifyReducer";
import LoadingReducer from "./LoadingReducer";
import UserReducer from "./UserReducer";
import ResetReducer from "./ResetReducer";
import shopping_cart_reducer from "./ShoppingCartReducer";
import active_background_reducer from "./ActiveBackgroundReducer";
import orderReducer from "./OrderReducer";
import ListComments from "./CommentReducer";
import PostCategory from "./PostCategoryReducer";
import ProductReviewReducer from "./ProductReviewReducer";
import UserProfileReducer from "./UserProfileReducer";
const rootReducer = combineReducers({
  productReducer,
  NotifyReducer,
  LoadingReducer,
  UserReducer,
  ResetReducer,
  shopping_cart_reducer,
  active_background_reducer,
  orderReducer,
  ListComments,
  PostCategory,
  ProductReviewReducer,
  UserProfileReducer,
});
export default rootReducer;
