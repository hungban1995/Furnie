import * as types from "./Constants";
const initState = {
  simpleAttribute: [],
  attributeId: [],
  updateAttribute: {
    update: false,
    attribute: {},
  },
};
const AttributeReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_ATTRIBUTE: {
      return { ...state, simpleAttribute: action.payload };
    }
    case types.GET_ATTRIBUTE_ID: {
      return { ...state, attributeId: action.payload };
    }
    case types.GET_ATTRIBUTE_UPDATE: {
      return { ...state, updateAttribute: action.payload };
    }
    case types.GET_COUNT: {
      return initState;
    }
    default:
      return state;
  }
};
export default AttributeReducer;
