import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import * as action from "../store/Action";
const MobileNavbarMenu = (props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);
  return (
    <>
      <Navbar
        className={
          "navbar-menu-mobile shadow" +
          (show ? " navbar-menu-mobile--active" : "")
        }
      >
        <div className="navbar-menu-mobile__header">
          <Link
            href="/"
            className="navbar-menu-mobile__logo"
            onClick={() => props.openNavbarMenuMobile()}
          >
            Furnie
          </Link>
          <AiOutlineCloseCircle
            className="navbar-menu-mobile__close-icon"
            onClick={() => props.openNavbarMenuMobile()}
          />
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link
              href="/"
              className="nav-link"
              onClick={() => props.openNavbarMenuMobile()}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="nav-link"
              onClick={() => props.openNavbarMenuMobile()}
            >
              Shop
            </Link>
            <Link
              href="/blog"
              className="nav-link"
              onClick={() => props.openNavbarMenuMobile()}
            >
              Blog
            </Link>
            <Link
              href="/login"
              className="nav-link"
              onClick={() => props.openNavbarMenuMobile()}
            >
              Acount
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    handle_active_active_background: () => {
      dispatch(action.active_active_background());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MobileNavbarMenu);
