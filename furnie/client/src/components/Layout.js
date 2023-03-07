import Header from "./Header";
import Notify from "./Notify";
import Loading from "./Loading";
import { connect } from "react-redux";
import { useEffect, useCallback } from "react";
import { postData } from "../libs/fetchData";
import { REFRESH_TOKEN_URL } from "../constants/index";
import * as action from "../store/Action";
import getError from "../libs/getError";
import ShoppingCart from "./ShoppingCart.js";
import ActiveBackground from "./ActiveBackground";
import { useRouter } from "next/router";
import Footer from "./Footer";
import BackToTopIcon from "./BackToTopIcon";

const Layout = (props) => {
  //Defined router
  const router = useRouter();

  //Check login
  const checkLogin = useCallback(() => {
    return new Promise((resolve) => {
      if (localStorage && localStorage.getItem("firstLogin")) {
        resolve(JSON.parse(localStorage.getItem("firstLogin")));
      } else {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
      }
    });
  }, []);

  //Get refresh Token
  const getRefreshToken = useCallback(() => {
    return new Promise(async (resolve) => {
      const firstLogin = await checkLogin();
      if (!firstLogin) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return;
      }
      if (localStorage && localStorage.getItem("refreshToken")) {
        resolve(JSON.parse(localStorage.getItem("refreshToken")));
      } else {
        localStorage.removeItem("firstLogin");
        localStorage.removeItem("accessToken");
      }
    });
  }, []);

  //Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = await getRefreshToken();
      props.get_loading(true);
      const res = await postData(`${REFRESH_TOKEN_URL}`, {
        refreshToken: currentRefreshToken,
      });
      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      props.get_current_user(user);
      props.get_loading(false);
    } catch (err) {
      props.get_loading(false);
      localStorage.removeItem("firstLogin");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      props.get_notify(getError(err));
    }
  }, []);

  //Checkout shopping cart
  const checkShoppingCart = useCallback(() => {
    if (localStorage && localStorage.getItem("cart")) {
      props.get_shopping_cart(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  //Use effect
  useEffect(() => {
    refreshToken();
    checkShoppingCart();
  }, [props.count]);
  return (
    <>
      <Header />
      <Notify />
      <Loading />
      <ShoppingCart />
      <ActiveBackground />
      {props.children}
      <BackToTopIcon />
      <Footer />
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    count: state.ResetReducer.count,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    get_loading: (loading) => {
      dispatch(action.getLoading(loading));
    },
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    get_current_user: (current_user) => {
      dispatch(action.getCurrentUser(current_user));
    },
    get_shopping_cart: (cart) => {
      dispatch(action.get_shopping_cart(cart));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
