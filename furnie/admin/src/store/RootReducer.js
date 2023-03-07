import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import ProductReducer from "./ProductReducer";
import NotifyReducer from "./NotifyReducer";
import ModalReducer from "./ModalReducer";
import PostCategoryReducer from "./PostCategoryReducer";
import PostReducer from "./PostReducer";
import ProductCategoryReducer from "./ProductCategoryReducer";
import AttributeReducer from "./AttributeReducer";
import CounterReducer from "./CounterReducer";
import HomePageManagerReducer from "./HomePageMangerReducer";
import RefreshReducer from "./RefreshReducer";
import LoadingReducer from "./LoadingReducer";

const rootReducer = combineReducers({
  UserReducer,
  ProductReducer,
  NotifyReducer,
  ModalReducer,
  PostCategoryReducer,
  ProductCategoryReducer,
  AttributeReducer,
  PostReducer,
  CounterReducer,
  HomePageManagerReducer,
  RefreshReducer,
  LoadingReducer,
});
export default rootReducer;
