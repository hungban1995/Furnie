import Container from "react-bootstrap/Container";
import { connect } from "react-redux";
import {
  BASE_URL,
  UPDATE_USER_URL,
  USER_LOGOUT_URL,
} from "../../constants/index";
import * as action from "../../store/Action";
import { useState, useEffect, useCallback } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FcEditImage } from "react-icons/fc";
import { useRouter } from "next/router";
import typeOf from "../../libs/typeOf";
import { patchData, postData } from "../../libs/fetchData";
import getError from "../../libs/getError";
import Head from "next/head";
import UserOrderManager from "../../components/UserOrderManager";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Link from "next/link";
const profile = (props) => {
  //Defind router
  const router = useRouter();
  //Current user state
  const [current_user, set_current_user] = useState(null);
  //Access token
  const [accessToken, setAccessToken] = useState(null);
  //Refresh token
  const [refreshToken, setRefreshToken] = useState(null);
  //Get on change values
  const onHandleChange = (e) => {
    if (e.target.name === "image") {
      set_current_user({ ...current_user, avatar: e.target.files[0] });
    } else {
      set_current_user({ ...current_user, [e.target.name]: e.target.value });
    }
  };
  //On handle submit
  const onHandleSubmit = async (e) => {
    try {
      props.get_loading(true);
      e.preventDefault();
      if (current_user.password) {
        if (!current_user.confirmPassword) {
          return props.get_notify({
            error: true,
            message: "Please confirm password",
          });
        }
        if (current_user.password !== current_user.confirmPassword) {
          return props.get_notify({
            error: true,
            message: "Password is not match",
          });
        }
      }
      //Defined form data
      const formData = new FormData();
      formData.append("username", current_user.username);
      formData.append("image", current_user.avatar);
      formData.append("email", current_user.email);
      if (current_user.password) {
        formData.append("password", current_user.password);
        formData.append("confirmPassword", current_user.confirmPassword);
      }
      await patchData(
        `${UPDATE_USER_URL}/${current_user._id}`,
        formData,
        accessToken
      );
      props.get_loading(false);
      props.reset_component();
      set_current_user({ ...current_user, password: "", confirmPassword: "" });
      props.get_notify({ success: true, message: "Update profile success" });
    } catch (err) {
      console.log(err);
      props.get_loading(false);
      props.get_notify(getError(err));
    }
  };
  //Handle logout
  const onHandleLogout = async (e) => {
    e.preventDefault();
    try {
      props.get_loading(true);
      await postData(`${USER_LOGOUT_URL}`, { refreshToken });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("firstLogin");
      router.push("/login");
      props.get_notify({ success: true, message: "Logout success" });
      props.set_current_user({});
      props.get_loading(false);
    } catch (err) {
      props.get_loading(false);
      props.get_notify(getError(err));
    }
  };
  //Get accessToken
  const getAccessToken = useCallback(() => {
    return new Promise(() => {
      if (localStorage && localStorage.getItem("accessToken")) {
        setAccessToken(JSON.parse(localStorage.getItem("accessToken")));
      } else {
        setAccessToken(null);
      }
    });
  }, []);
  //Get refreshToken
  const getRefreshToken = useCallback(() => {
    return new Promise(() => {
      if (localStorage && localStorage.getItem("refreshToken")) {
        setRefreshToken(JSON.parse(localStorage.getItem("refreshToken")));
      } else {
        setRefreshToken(null);
      }
    });
  }, []);
  //Check login
  const checkLogin = useCallback(() => {
    return new Promise(() => {
      let firstLogin;
      if (localStorage && localStorage.getItem("firstLogin")) {
        firstLogin = JSON.parse(localStorage.getItem("firstLogin"));
      }
      if (!firstLogin) {
        router.push("/login");
      }
    });
  }, []);
  //Use effect
  useEffect(() => {
    checkLogin();
    getAccessToken();
    getRefreshToken();
  }, []);
  useEffect(() => {
    set_current_user(props.current_user);
  }, [props.current_user]);
  if (!current_user)
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Container>
        <Breadcrumb className="breadcrumb-custom">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>
          <Breadcrumb.Item active>Profile</Breadcrumb.Item>
        </Breadcrumb>
        <Row className="user-profile">
          <Col className="p-3 user-profile__info" md={4}>
            <Form
              className="user-profile__form shadow p-2"
              encType="multipart/form-data"
            >
              <h3 className="h3 mb-3 text-center">Your profile</h3>
              <Form.Group
                className="mb-3 form__avatar-container"
                controlId="image"
              >
                <Form.Label className="form__avatar">
                  <span>
                    <img
                      src={
                        current_user.avatar
                          ? typeOf(current_user.avatar) !== "String"
                            ? URL.createObjectURL(current_user.avatar)
                            : `${BASE_URL}/${current_user.avatar}`
                          : "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_960_720.png"
                      }
                    />
                    <FcEditImage
                      className="form__avatar-upload"
                      title="Change your avatar"
                    />
                  </span>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  hidden
                  onChange={onHandleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="username"
                  name="username"
                  onChange={onHandleChange}
                  value={current_user.username || ""}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={current_user.email || ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={current_user.password || ""}
                  onChange={onHandleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="New password"
                  value={current_user.confirmPassword || ""}
                  onChange={onHandleChange}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                onClick={onHandleSubmit}
              >
                Update profile
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                onClick={onHandleLogout}
              >
                Logout
              </Button>
            </Form>
          </Col>
          <UserOrderManager
            userId={current_user._id}
            accessToken={accessToken}
          />
        </Row>
      </Container>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    current_user: state.UserReducer.current_user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    set_current_user: (current_user) => {
      dispatch(action.getCurrentUser(current_user));
    },

    get_loading: (loading) => {
      dispatch(action.getLoading(loading));
    },
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    reset_component: () => {
      dispatch(action.reset_component());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(profile);
