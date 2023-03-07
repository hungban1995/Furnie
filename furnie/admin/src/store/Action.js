import * as types from "./Constants";

export const getUserUpdate = (user) => {
  return {
    type: types.GET_USER_UPDATE,
    payload: user,
  };
};

export const setNotify = (notify) => {
  return {
    type: types.GET_NOTIFY,
    payload: notify,
  };
};
export const getUserLogin = (user) => {
  return {
    type: types.GET_USER_LOGIN,
    payload: user,
  };
};

export const getModal = (modal) => {
  return {
    type: types.GET_MODAL,
    payload: modal,
  };
};
export const setPostCategoryCreate = (create) => {
  return { type: types.GET_POST_CATEGORY_CREATE, payload: create };
};
export const getPostCategoryUpdate = (categoryUpdate) => {
  return {
    type: types.GET_POST_CATEGORY_UPDATE,
    payload: categoryUpdate,
  };
};
export const setPostCreate = (create) => {
  return { type: types.GET_POST_CREATE, payload: create };
};

export const getPostUpdate = (updatePost) => {
  return {
    type: types.GET_POST_UPDATE,
    payload: updatePost,
  };
};

export const getProductCategoryUpdate = (category) => {
  return { type: types.GET_PRODUCT_CATEGORY_UPDATE, payload: category };
};
export const getProductUpdate = (product) => {
  return { type: types.GET_PRODUCT_UPDATE, payload: product };
};

export const getAttribute = (attribute) => {
  return { type: types.GET_ATTRIBUTE, payload: attribute };
};
export const getAttributeUpdate = (attribute) => {
  return { type: types.GET_ATTRIBUTE_UPDATE, payload: attribute };
};
export const getAttributeID = (attributeId) => {
  return { type: types.GET_ATTRIBUTE_ID, payload: attributeId };
};

export const setCount = () => {
  return {
    type: types.GET_COUNT,
  };
};

export const setHomeSlide = (slideList) => {
  return { type: types.SET_HOME_SLIDE, payload: slideList };
};
export const setIsEdit = (edit) => {
  return {
    type: types.SET_IS_EDIT,
    payload: edit,
  };
};

export const refreshApp = () => {
  return {
    type: types.SET_REFRESH,
  };
};

export const setLoading = (loading) => {
  return {
    type: types.SET_LOADING,
    payload: loading,
  };
};
