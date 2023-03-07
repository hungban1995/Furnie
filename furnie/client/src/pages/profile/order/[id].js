import { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import { getData } from "../../../libs/fetchData";
import { GET_ORDER_ID } from "../../../constants/index";
import getError from "../../../libs/getError";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import formatPrice from "../../../libs/formatPrice";
import Link from "next/link";
import Head from "next/head";
import Breadcrumb from "react-bootstrap/Breadcrumb";
const orderDetails = (props) => {
  const [order, setOder] = useState(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  useEffect(() => {
    if (localStorage && localStorage.getItem("accessToken")) {
      setAccessToken(JSON.parse(localStorage.getItem("accessToken")));
    }
  }, []);
  useEffect(() => {
    if (props.orderId && accessToken) {
      getData(`${GET_ORDER_ID}/${props.orderId}`, accessToken)
        .then((res) => setOder(res.data.order))
        .catch((err) => props.getNotify(getError(err)));
    }
  }, [props.orderId, accessToken]);
  useEffect(() => {
    const currentStatus = order
      ? order.status.filter((item) => item.v === true)
      : null;
    currentStatus
      ? setCurrentStatus(currentStatus[0].k)
      : setCurrentStatus(null);
  }, [order]);
  useEffect(() => {
    setIsTimeout(() => {
      setIsTimeout(true);
    }, 5000);
  }, []);
  if (!order && !isTimeout) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  if (!order && isTimeout) {
    return (
      <Container>
        <div>Order not found</div>
      </Container>
    );
  }
  return (
    <Container>
      <Head>
        <title>Order details</title>
      </Head>
      <Breadcrumb className="breadcrumb-custom">
        <Link href="/" className="breadcrumb-item">
          Home
        </Link>
        <Link href="/profile" className="breadcrumb-item">
          Profile
        </Link>
        <Breadcrumb.Item active>Order</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <h3 className="text-center mb-3 text-uppercase">Your order details</h3>
      </div>
      <Row>
        <Col md={6}>
          <h3>Details:</h3>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Order code:</td>
                <td>{order._id}</td>
              </tr>
              <tr>
                <td>First name:</td>
                <td>{order.firstName}</td>
              </tr>
              <tr>
                <td>Last name</td>
                <td>{order.lastName}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{order.email}</td>
              </tr>
              <tr>
                <td>Phone number:</td>
                <td>{order.phoneNumber}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{order.address}</td>
              </tr>
              <tr>
                <td>Created date:</td>
                <td>{order.createDate}</td>
              </tr>
              <tr>
                <td>Total quantity:</td>
                <td>{order.quantity}</td>
              </tr>
              <tr>
                <td>Total price:</td>
                <td>{formatPrice(order.total)}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{currentStatus}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <h3>Your cart:</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.cart.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link href={`/product/${item.url}.${item.product_id}`}>
                        {item.title}
                        {item.attribute ? ` - ${item.attribute}` : ""}
                      </Link>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">{formatPrice(item.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    orderId: state.UserProfileReducer.orderId,
  };
};
const mapDispatchToProps = (props) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(orderDetails);
