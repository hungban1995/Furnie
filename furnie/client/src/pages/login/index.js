import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import Head from "next/head";
import Link from "next/link";
import { connect } from "react-redux";
import * as action from "../../store/Action";
import getError from "../../libs/getError";
import { postData } from "../../libs/fetchData";
import { LOGIN_URL } from "../../constants/index.js";
import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";
//Defined login page
const login = (props) => {
  //Definded router
  const router = useRouter();
  //Login schema
  const loginSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be less 6 charector"),
  });
  //Check firstLogin
  const checkLogin = useCallback(() => {
    let firstLogin;
    if (localStorage && localStorage.getItem("firstLogin")) {
      firstLogin = JSON.parse(localStorage.getItem("firstLogin"));
    }
    if (firstLogin) {
      router.push("/profile");
    }
  }, []);
  //Use Effect
  useEffect(() => {
    checkLogin();
  }, []);
  //Handle login
  const handleLogin = async (values, action) => {
    try {
      props.getLoading(true);
      const res = await postData(`${LOGIN_URL}`, values);
      props.getLoading(false);
      props.getNotify({ success: true, message: "Login success" });
      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem("firstLogin", JSON.stringify(true));
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      props.get_current_user(user);
      action.resetForm();
      router.push("/profile");
    } catch (err) {
      props.getLoading(false);
      console.log("Handle login errors: ", err);
      props.getNotify(getError(err));
    }
  };
  //Render html
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container>
        <Formik
          validationSchema={loginSchema}
          onSubmit={async (values, action) => {
            await handleLogin(values, action);
          }}
          initialValues={{
            email: "",
            password: "",
          }}
        >
          {({ handleSubmit, handleBlur, handleChange, values, errors }) => (
            <Form
              className="login shadow p-3"
              noValidate
              onSubmit={handleSubmit}
            >
              <h3 className="h3 text-center mb-3">Login</h3>

              <Form.Group className="mb-3" controlId="validationFormik101">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email}
                />
                <Form.Text className="text-danger">{errors.email}</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="validationFormik102">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.password}
                  name="password"
                />
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              </Form.Group>
              <p>
                You have not account? <Link href="/register">Register</Link>
              </p>
              <Button variant="primary" type="submit" className="w-100">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    getLoading: (loading) => {
      dispatch(action.getLoading(loading));
    },
    get_current_user: (current_user) => {
      dispatch(action.getCurrentUser(current_user));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(login);
