import { connect } from "react-redux";
import * as action from "../store/Action";
import { useState, useEffect } from "react";
const ActiveBackground = (props) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(props.active_active_background);
  }, [props.active_active_background]);
  const onHandleClick = () => {
    if (props.active_active_background && props.active_shopping_cart) {
      props.handle_active_active_background();
      props.handle_active_shopping_cart();
      return;
    }
  };
  return (
    <div
      className={
        "active-background " + (active ? "active-background--active" : "")
      }
      onClick={onHandleClick}
    ></div>
  );
};
const mapStateToProps = (state) => {
  return {
    active_active_background: state.active_background_reducer.active,
    active_shopping_cart: state.shopping_cart_reducer.active,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handle_active_active_background: () => {
      dispatch(action.active_active_background());
    },
    handle_active_shopping_cart: () => {
      dispatch(action.active_shopping_cart());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ActiveBackground);
