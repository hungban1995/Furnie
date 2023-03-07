import * as type from "./Constants";
const initState = {
  active: false,
  cart: [],
};
const shopping_cart_reducer = (state = initState, action) => {
  switch (action.type) {
    //Active shopping cart
    case type.ACTIVE_SHOPPING_CART: {
      return { ...state, active: !state.active };
    }
    //Add product to cart
    case type.ADD_PRODUCT_TO_CART: {
      const { attribute_id, product_id } = action.payload;
      //Nếu state.cart.length === 0
      if (state.cart.length === 0) {
        localStorage.setItem("cart", JSON.stringify([action.payload]));
        return { ...state, cart: [...state.cart, action.payload] };
      }
      let currentCart = state.cart;
      let currentItem = null;
      //Không có attribute_id
      if (!attribute_id) {
        currentCart.forEach((item, index) => {
          if (item.product_id === product_id) {
            currentItem = { item, index };
          }
        });
        if (currentItem) {
          currentCart[currentItem.index].quantity += 1;
          localStorage.setItem("cart", JSON.stringify(currentCart));
          return { ...state, cart: currentCart };
        }
        currentCart = [...state.cart, action.payload];
        localStorage.setItem("cart", JSON.stringify(currentCart));
        return { ...state, cart: currentCart };
      }
      //Có attribute_id
      currentCart.forEach((item, index) => {
        if (
          attribute_id === item.attribute_id &&
          product_id === item.product_id
        ) {
          currentItem = { item, index };
        }
      });
      if (currentItem) {
        currentCart[currentItem.index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(currentCart));
        return { ...state, cart: currentCart };
      }
      currentCart = [...state.cart, action.payload];
      localStorage.setItem("cart", JSON.stringify(currentCart));
      return { ...state, cart: currentCart };
    }
    //UPdate cart item quantity
    case type.UPDATE_CART_ITEM_QUANTITY: {
      const currentCart = state.cart;

      let currentItem = null;

      const { quantity, product_id, attribute_id } = action.payload;

      //Không có attribute_id
      if (!attribute_id) {
        currentCart.forEach((item, index) => {
          if (item.product_id === product_id) {
            currentItem = { item, index };
          }
        });

        if (currentItem) {
          currentCart[currentItem.index].quantity = quantity;
          localStorage.setItem("cart", JSON.stringify(currentCart));
          return { ...state, cart: currentCart };
        }
      }

      //Có attribute_id
      currentCart.forEach((item, index) => {
        if (
          item.product_id === product_id &&
          item.attribute_id === attribute_id
        ) {
          currentItem = { item, index };
        }
      });
      if (currentItem) {
        currentCart[currentItem.index].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(currentCart));
        return { ...state, cart: currentCart };
      }
      return state;
    }
    //Get shopping cart
    case type.GET_SHOPPING_CART: {
      return { ...state, cart: action.payload };
    }
    //Delete cart item
    case type.DELETE_CART_ITEM: {
      let currentCart = state.cart;
      let newCart = [];
      const { product_id, attribute_id } = action.payload;
      if (!attribute_id) {
        newCart = currentCart.filter((item) => item.product_id !== product_id);
        localStorage.setItem("cart", JSON.stringify(newCart));
        return { ...state, cart: newCart };
      }

      newCart = currentCart.filter(
        (item) => item.attribute_id !== attribute_id
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    //Reset cart
    case type.RESET_CART: {
      if (localStorage && localStorage.getItem("cart")) {
        localStorage.removeItem("cart");
      }
      return { ...state, cart: [] };
    }
    default:
      return state;
  }
};
export default shopping_cart_reducer;
