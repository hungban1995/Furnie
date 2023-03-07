import { useEffect, useState, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { connect } from "react-redux";
import * as action from "../../../../store/Action";
import { getData, putData } from "../../../../libs/fetchData";
import { GET_ORDER_ID, UPDATE_ORDER_URL } from "../../../../constants/index";
import Head from "next/head";
import getError from "../../../../libs/getError";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/router";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Link from "next/link";

const userUpdateOrderSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  paymentMethod: yup.number().required("Please select an payment method"),
});
const editOrder = (props) => {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  useEffect(() => {
    if (localStorage && localStorage.getItem("accessToken")) {
      setAccessToken(JSON.parse(localStorage.getItem("accessToken")));
    }
  }, [props.orderId]);
  useEffect(() => {
    if (props.orderId && accessToken) {
      getData(`${GET_ORDER_ID}/${props.orderId}`, accessToken)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch((err) => props.getNotify(getError(err)));
    }
  }, [props.orderId, accessToken]);
  useEffect(() => {
    if (order) {
      const currentStatus = order.status
        ? order.status.filter((item) => item.v === true)
        : null;
      currentStatus
        ? setCurrentStatus(currentStatus[0].k)
        : setCurrentStatus(null);
    }
  }, [order]);
  const onChangeGetStatus = (e) => {
    if (e.target.value !== currentStatus) {
      order.status.forEach((item) => {
        if (item.k === e.target.value) {
          item.v = true;
        } else {
          item.v = false;
        }
      });
      setCurrentStatus(e.target.value);
    }
  };
  const onHandleUpdateOrder = async (values) => {
    try {
      props.getLoading(true);
      const res = await putData(
        `${UPDATE_ORDER_URL}/${order._id}`,
        {
          order: {
            ...values,
            status: order.status,
            cart: order.cart,
            user: order.user,
            quantity: order.quantity,
            total: order.total,
            createDate: order.createDate,
            _id: order._id,
          },
        },
        accessToken
      );
      props.getLoading(false);
      props.getNotify({ success: true, message: res.data.success });
      router.push(`/profile/order/${order._id}`);
    } catch (err) {
      props.getLoading(false);
      props.getNotify(getError(err));
    }
  };
  if (!order || !currentStatus)
    return (
      <Container>
        <div>Loading....</div>
      </Container>
    );
  return (
    <>
      <Head>
        <title>Edit order</title>
      </Head>
      <Container>
        <Breadcrumb className="breadcrumb-custom">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>
          <Link href="/profile" className="breadcrumb-item">
            Profile
          </Link>
          <Breadcrumb.Item active>Order</Breadcrumb.Item>
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Formik
            validationSchema={userUpdateOrderSchema}
            onSubmit={async (values) => await onHandleUpdateOrder(values)}
            initialValues={{
              firstName: order.firstName,
              lastName: order.lastName,
              address: order.address,
              phoneNumber: order.phoneNumber,
              email: order.email,
              paymentMethod: order.paymentMethod,
            }}
          >
            {function ({
              handleSubmit,
              handleBlur,
              handleChange,
              values,
              errors,
            }) {
              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="validationFormik101">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Text className="text-danger">
                      {errors.firstName}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="validationFormik102">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Text className="text-danger">
                      {errors.lastName}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="validationFormik103">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.address}
                    />
                    <Form.Text className="text-danger">
                      {errors.address}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="validationFormik104">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Text className="text-danger">
                      {errors.phoneNumber}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="validationFormik105">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.email}
                    />
                    <Form.Text className="text-danger">
                      {errors.email}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="validationFormik106">
                    <Form.Label>Payment</Form.Label>
                    <Form.Select
                      onChange={handleChange}
                      value={values.paymentMethod}
                      name="paymentMethod"
                      onBlur={handleBlur}
                      isInvalid={!!errors.paymentMethod}
                    >
                      <option value={1}>COD</option>
                      <option value={2}>Internet banking</option>
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {errors.paymentMethod}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="validationFormik106">
                    <Form.Label>
                      Status{" "}
                      <span className="text-danger">
                        Change status to CANCEL to cancel order
                      </span>
                    </Form.Label>
                    <Form.Select
                      onChange={onChangeGetStatus}
                      value={currentStatus}
                      name="status"
                    >
                      <option value="Waiting">Waiting</option>
                      <option value="Cancel">Cancel</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-2">
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Container>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    orderId: state.UserProfileReducer.orderId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    getLoading: (loading) => {
      dispatch(action.getLoading(loading));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(editOrder);
