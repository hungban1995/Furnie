import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import Head from "next/head";
import { postData } from "../../libs/fetchData";
import { REGISTER_URL } from "../../constants/index";
import getError from "../../libs/getError";
import * as action from "../../store/Action";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

//Defind register page
const register = (props) => {
  //Defind router
  const router = useRouter();

  //Register schema
  const registerSchema = yup.object().shape({
    username: yup.string().required("User name is required"),
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password be min less 6 charector"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .min(6, "Confirm password must be less 6 charector"),
  });

  //Check login
  const checkLogin = useCallback(() => {
    let firstLogin;
    if (localStorage && localStorage.getItem("firstLogin")) {
      firstLogin = JSON.parse(localStorage.getItem("firstLogin"));
    }
    if (firstLogin) {
      router.push("/profile");
    }
  }, []);

  //Use effect
  useEffect(() => {
    checkLogin();
  }, []);

  //Handle register
  const handleRegister = async (values, action) => {
    try {
      props.getLoading(true);
      if (values.password !== values.confirmPassword) {
        props.getLoading(false);
        props.getNotify({
          error: true,
          message: "Password is not match",
        });
        return;
      }
      const res = await postData(`${REGISTER_URL}`, values);
      props.getLoading(false);
      props.getNotify({
        success: true,
        message: res.data.success,
      });
      action.resetForm();
      router.push("/login");
    } catch (err) {
      props.getLoading(false);
      props.getNotify(getError(err));
    }
  };

  //Render htlm
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Container>
        <Formik
          validationSchema={registerSchema}
          onSubmit={async (values, action) => {
            await handleRegister(values, action);
          }}
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
            <Form
              className="register-form mx-auto shadow p-3"
              onSubmit={handleSubmit}
              noValidate
            >
              <h3 className="h3 text-center mb-3">Register</h3>

              <Form.Group className="mb-3" controlId="validationFormik101">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.username}
                />
                <Form.Text className="text-danger">{errors.username}</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="validationFormik102">
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

              <Form.Group className="mb-3" controlId="validationFormik103">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.password}
                />
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="validationFormik103">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Text className="text-danger">
                  {errors.confirmPassword}
                </Form.Text>
              </Form.Group>

              <p className="mb-3">
                You have account? <Link href="/login">Login</Link>
              </p>

              <Button variant="primary" type="submit" className="w-100">
                Register
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
const mapDispatchToState = (dispatch) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    getLoading: (loading) => {
      dispatch(action.getLoading(loading));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToState)(register);
