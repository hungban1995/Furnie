import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { connect } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import Table from "react-bootstrap/Table";
import formatPrice from "../../libs/formatPrice";
import { BiEdit } from "react-icons/bi";
import * as action from "../../store/Action";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import { postData } from "../../libs/fetchData";
import getError from "../../libs/getError";
import { CREATE_ORDER_URL } from "@/constants";
import { useRouter } from "next/router";
import { BsCartX } from "react-icons/bs";
import Link from "next/link";

const checkout = (props) => {
  const [cart, setCart] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  //Defined router
  const router = useRouter();
  //Checkout schema
  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    address: yup.string().required("Address is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    email: yup.string().required("Email is required").email("Email is invalid"),
    paymentMethod: yup.number().required("Please select an payment method"),
  });
  //Get quantity
  const quantity = (cart) => {
    let quantity = 0;
    cart.forEach((item) => {
      quantity += item.quantity;
    });
    return quantity;
  };
  //Get total
  const total = (cart) => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };
  //Handle edit cart
  const handleEditCart = () => {
    props.active_shopping_cart();
    props.active_active_background();
  };
  //Handle checkout
  const handleCheckout = async (values, action) => {
    try {
      props.get_loading(true);
      const order = values;
      order.quantity = quantity(cart);
      order.total = total(cart);
      order.cart = cart;
      if (order.quantity === 0 || order.total === 0) {
        props.get_loading(false);
        return props.get_notify({
          error: true,
          message: "You must be have least 1 product in cart to checkout",
        });
      }
      const res = await postData(`${CREATE_ORDER_URL}`, { order }, accessToken);
      action.resetForm();
      props.get_loading(false);
      props.get_notify({ success: true, message: "Create order success" });
      props.getOrder(res.data.order);
      props.resetCart();
      router.push("/thank-you");
    } catch (err) {
      props.get_loading(false);
      props.get_notify(getError(err));
    }
  };
  useEffect(() => {
    setCart(props.cart);
  }, [props.cart]);
  useEffect(() => {
    if (localStorage && localStorage.getItem("accessToken")) {
      setAccessToken(JSON.parse(localStorage.getItem("accessToken")));
    }
  }, []);
  useEffect(() => {
    if (props.currentUser) {
      return setCurrentUser(props.currentUser);
    }
    setCurrentUser({});
  }, [props.currentUser]);
  return (
    <Container>
      {cart.length === 0 ? (
        <div className="checkout-page--empty">
          <div className="checkout-page--empty__icon-container">
            <BsCartX className="checkout-page--empty__cart text-danger" />
            <p className="checkout-page--empty__text">
              Your cart is empty, back to <Link href="/shop">shop</Link>
            </p>
          </div>
        </div>
      ) : (
        <Row className="py-3">
          <Col lg={6}>
            <Row>
              <Col>
                <h2>Your cart</h2>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <BiEdit
                  style={{ width: "25px", height: "25px", cursor: "pointer" }}
                  title="Edit your cart"
                  onClick={() => handleEditCart()}
                />
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item.title}-{item.attribute} <br />{" "}
                        {formatPrice(item.price)}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={2}></td>

                  <td
                    className="text-center"
                    style={{ fontSize: "20px", fontWeight: "500" }}
                  >
                    {quantity(cart)}
                  </td>
                  <td
                    className="text-end"
                    style={{ fontSize: "20px", fontWeight: "500" }}
                  >
                    {formatPrice(total(cart))}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col lg={6}>
            <h2>Checkout address</h2>
            <div>
              <Formik
                validationSchema={checkoutSchema}
                onSubmit={async (values, action) => {
                  await handleCheckout(values, action);
                }}
                initialValues={{
                  firstName: "",
                  lastName: "",
                  address: "",
                  phoneNumber: "",
                  email:
                    Object.keys(currentUser).length > 0
                      ? currentUser.email
                      : "",
                  paymentMethod: "",
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
                      <Form.Group
                        className="mb-3"
                        controlId="validationFormik101"
                      >
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your first name"
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

                      <Form.Group
                        className="mb-3"
                        controlId="validationFormik102"
                      >
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your last name"
                          name="lastName"
                          value={values.lastName}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          isInvalid={!!errors.lastName}
                        />
                        <Form.Text className="text-danger">
                          {errors.lastName}
                        </Form.Text>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="validationFormik103"
                      >
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your address"
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

                      <Form.Group
                        className="mb-3"
                        controlId="validationFormik104"
                      >
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your phone number"
                          name="phoneNumber"
                          value={values.phoneNumber}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          isInvalid={!!errors.phoneNumber}
                        />
                        <Form.Text className="text-danger">
                          {errors.phoneNumber}
                        </Form.Text>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="validationFormik105"
                      >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Your email"
                          name="email"
                          value={values.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Text className="text-danger">
                          {errors.email}
                        </Form.Text>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="validationFormik106"
                      >
                        <Form.Label>Payment method</Form.Label>
                        <Form.Select
                          name="paymentMethod"
                          value={values.paymentMethod}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          isInvalid={!!errors.paymentMethod}
                        >
                          <option>Select an payment method</option>
                          <option value={1}>COD</option>
                          <option value={2}>Inter net banking</option>
                        </Form.Select>
                        <Form.Text className="text-danger">
                          {errors.paymentMethod}
                        </Form.Text>
                      </Form.Group>

                      <Button
                        variant="danger"
                        type="submit"
                        className="w-100"
                        style={{ borderRadius: "0" }}
                      >
                        Checkout
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    cart: state.shopping_cart_reducer.cart,
    currentUser: state.UserReducer.current_user,
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
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    get_loading: (loading) => {
      dispatch(action.getLoading(loading));
    },
    getOrder: (order) => {
      dispatch(action.getOrder(order));
    },
    resetCart: () => {
      dispatch(action.resetCart());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkout);
