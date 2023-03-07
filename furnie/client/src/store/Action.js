import * as type from "./Constants";

//Get product action
export const getProduct = (product) => {
  return {
    type: type.GET_PRODUCT,
    payload: product,
  };
};

//Get notify action
export const getNotify = (notify) => {
  return {
    type: type.GET_NOTIFY,
    payload: notify,
  };
};

//Get loading
export const getLoading = (loading) => {
  return {
    type: type.GET_LOADING,
    payload: loading,
  };
};

//Get user
export const getCurrentUser = (current_user) => {
  return {
    type: type.GET_CURRENT_USER,
    payload: current_user,
  };
};

//Reset component
export const reset_component = () => {
  return {
    type: type.RESET_COMPONENT,
  };
};

//Active shopping cart
export const active_shopping_cart = () => {
  return {
    type: type.ACTIVE_SHOPPING_CART,
  };
};

//Active active background
export const active_active_background = () => {
  return {
    type: type.ACTIVE_ACTIVE_BACKGROUND,
  };
};

//Get shopping cart
export const add_product_to_cart = (product) => {
  return {
    type: type.ADD_PRODUCT_TO_CART,
    payload: product,
  };
};

//Update cart item quantity
export const update_cart_item_quantity = (payload) => {
  return {
    type: type.UPDATE_CART_ITEM_QUANTITY,
    payload,
  };
};

//Get shopping cart
export const get_shopping_cart = (cart) => {
  return {
    type: type.GET_SHOPPING_CART,
    payload: cart,
  };
};

//Delete cart item
export const deleteCartItem = (payload) => {
  return {
    type: type.DELETE_CART_ITEM,
    payload,
  };
};
//Get order
export const getOrder = (order) => {
  return {
    type: type.GET_ORDER,
    payload: order,
  };
};

//Reset cart
export const resetCart = () => {
  return {
    type: type.RESET_CART,
  };
};

//Get list comment
export const listComment = (comment) => {
  return {
    type: type.COMMENT_LIST,
    payload: comment,
  };
};
//Get post category
export const postCategory = (category) => {
  return { type: type.POST_CATEGORY, payload: category };
};

export const resetProductReviewComponent = () => {
  return { type: type.RESET_PRODUCT_REVIEW_COMPONENT };
};
export const getOrderId = (orderId) => {
  return {
    type: type.GET_ORDER_ID,
    payload: orderId,
  };
};
