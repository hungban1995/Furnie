import Container from "react-bootstrap/Container";
import Link from "next/link";
import { BiSearchAlt, BiUser } from "react-icons/bi";
import { FaOpencart } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import MobileNavbarMenu from "./MobileNavbarMenu";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as action from "../store/Action";

const NavbarMenu = (props) => {
  const [show, setShow] = useState(false);
  const [cart, setCart] = useState([]);
  const openNavbarMenuMobile = () => {
    setShow(!show);
    props.active_active_background();
  };
  const activeShoppingCart = () => {
    props.active_shopping_cart();
    props.active_active_background();
  };

  useEffect(() => {
    setCart(props.cart);
  }, [props.cart]);
  return (
    <Container>
      <div className="navbar-menu-mobile__container">
        <FiMenu
          className="navbar-menu-mobile__icon"
          onClick={() => openNavbarMenuMobile()}
        />
        <Link href="/" className="navbar-menu-mobile__logo">
          FURNIE
        </Link>
        <a className="navbar-menu-mobile__cart-container">
          <span className="navbar-menu-mobile__cart-quantity">
            {cart.length}
          </span>
          <FaOpencart
            className="navbar-menu-mobile__cart"
            onClick={activeShoppingCart}
          />
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-menu__left">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-menu__middle">
          <Link href="/" className="logo">
            FURNIE
          </Link>
        </div>
        <div className="navbar-menu__right">
          <ul>
            <li>
              <Link href="#">
                <BiSearchAlt />
              </Link>
            </li>
            <li>
              <Link href="/login">
                <BiUser />
              </Link>
            </li>
            <li>
              <a onClick={activeShoppingCart} className="shopping-cart-icon">
                <span className="cart-quantity">{cart.length}</span>
                <FaOpencart />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <MobileNavbarMenu
        show={show}
        openNavbarMenuMobile={openNavbarMenuMobile}
      />
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    cart: state.shopping_cart_reducer.cart,
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavbarMenu);
