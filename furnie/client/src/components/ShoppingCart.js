import { connect } from "react-redux";
import * as action from "../store/Action";
import { useState, useEffect, useCallback } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BASE_URL } from "../constants/index";
import formatPrice from "@/libs/formatPrice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  BsFillArrowUpSquareFill,
  BsFillArrowDownSquareFill,
  BsDashSquare,
} from "react-icons/bs";
import { useRouter } from "next/router";
const ShoppingCart = (props) => {
  const [active, setActive] = useState(false);
  const [cart, setCart] = useState([]);
  //Defined router
  const router = useRouter();
  //Use effect
  useEffect(() => {
    setActive(props.active);
    setCart(props.cart);
  }, [props.active, props.cart, props.count]);
  //Close shopping cart
  const closeShoppingCart = () => {
    props.active_shopping_cart();
    props.active_active_background();
  };
  //Handle increase
  const quantityIncrease = (quantity, inStock, product_id, attribute_id) => {
    const newQuantity = quantity + 1;
    if (newQuantity > inStock) {
      return;
    }
    props.update_cart_item_quantity({
      quantity: newQuantity,
      product_id,
      attribute_id,
    });
    props.reset_component();
  };
  //Hanle decrease
  const quantityDecrease = (quantity, product_id, attribute_id) => {
    const newQuantity = quantity - 1;
    if (newQuantity < 1) {
      return;
    }
    props.update_cart_item_quantity({
      quantity: newQuantity,
      product_id,
      attribute_id,
    });
    props.reset_component();
  };
  //Get total
  const getCartTotal = (cart) => {
    let total = 0;
    let quantity = 0;
    cart.map((item) => {
      quantity += item.quantity;
      total += item.price * item.quantity;
    });
    return { total: formatPrice(total), quantity };
  };
  //Handle delete shopping cart item
  const handleDeleteCartItem = (product_id, attribute_id) => {
    if (!attribute_id && !product_id) {
      return props.get_notify({
        error: true,
        message: "Product does not exist in cart",
      });
    }
    props.delete_cart_item({ product_id, attribute_id });
    props.reset_component();
    props.get_notify({
      success: true,
      message: "Remove product from cart success",
    });
  };
  return (
    <div
      className={
        "shopping-cart shadow " + (active ? "shopping-cart--active" : "")
      }
    >
      <div className="shopping-cart__header">
        <AiOutlineCloseCircle
          className="close-icon"
          onClick={closeShoppingCart}
        />
        <h3>Your cart</h3>
      </div>
      <div className="shopping-cart__item-list">
        {cart.map((item, index) => {
          return (
            <Row key={index} className="shopping-cart__item">
              <Col lg={3} className="shopping-cart__item-image-container">
                <span className="shopping-cart__item-image d-block" href="#">
                  <img src={`${BASE_URL}/${item.image}`} className="w-100" />
                </span>
              </Col>
              <Col lg={9} className="shopping-cart__item-details">
                <Row className="shopping-cart__item-details-container">
                  <Col className="shopping-cart__item-details-left col-10">
                    <p>
                      {item.title}-{item.attribute}
                    </p>
                    <p>Price: {formatPrice(item.price)}</p>
                  </Col>
                  <Col className="shopping-cart__item-quantity-container col-2">
                    <div>
                      <BsFillArrowUpSquareFill
                        onClick={() => {
                          quantityIncrease(
                            item.quantity,
                            item.inStock,
                            item.product_id,
                            item.attribute_id || null
                          );
                        }}
                        className="decrease-btn"
                      />
                      <p className="mb-0 text-center">{item.quantity}</p>
                      <BsFillArrowDownSquareFill
                        onClick={() => {
                          quantityDecrease(
                            item.quantity,
                            item.product_id,
                            item.attribute_id || null
                          );
                        }}
                        className="increase-btn"
                      />
                    </div>
                    <BsDashSquare
                      className="delete-item-icon"
                      onClick={() =>
                        handleDeleteCartItem(item.product_id, item.attribute_id)
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        })}
      </div>
      <div className="shopping-cart__bottom">
        <p className="d-flex align-item-center justify-content-between">
          <span className="text">Quantity: </span>{" "}
          <span className="total">{getCartTotal(cart).quantity}</span>
        </p>
        <p className="d-flex align-item-center justify-content-between">
          <span className="text">Total: </span>{" "}
          <span className="total">{getCartTotal(cart).total}</span>
        </p>
        <p>
          <button
            className="btn btn-danger bg-danger w-100"
            onClick={() => {
              router.push("/checkout");
              closeShoppingCart();
            }}
          >
            Checkout
          </button>
        </p>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    active: state.shopping_cart_reducer.active,
    cart: state.shopping_cart_reducer.cart,
    count: state.ResetReducer.count,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    active_shopping_cart: () => {
      dispatch(action.active_shopping_cart());
    },
    active_active_background: () => {
      dispatch(action.active_active_background());
    },
    update_cart_item_quantity: (payload) => {
      dispatch(action.update_cart_item_quantity(payload));
    },
    reset_component: () => {
      dispatch(action.reset_component());
    },
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    delete_cart_item: (payload) => {
      dispatch(action.deleteCartItem(payload));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
