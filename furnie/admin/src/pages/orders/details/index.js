/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useCallback, useState } from "react";
import Table from "react-bootstrap/Table";
import { IMG_URL } from "../../../constants";
import { BsXSquare } from "react-icons/bs";
import { putData } from "../../../libs/fetchData";
import { connect } from "react-redux";
import * as action from "../../../store/Action";
import getError from "../../../libs/getError";
import { PriceVnd } from "../../../libs/ShowData";
import "./order.details.styles.css";

const orderDetails = (props) => {
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState([]);
  const [order, setOrder] = useState({});
  const [show, setShow] = useState(false);
  const [, setAccessToken] = useState("");
  const [viewOnly, setViewOnly] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(1);

  const getOnChangeHandleInfor = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const getCurrentStatus = (status) => {
    let currentStatus = "Watting";
    if (status && status.length > 0) {
      currentStatus = status.filter((item) => item.v !== false)[0].k;
    }
    return currentStatus;
  };

  const getOnChangeStatus = (e) => {
    let currentActive;
    status.forEach((item, index) => {
      if (item.v === true) {
        currentActive = { k: item.k, index };
      }
    });
    if (currentActive.k === e.target.value) {
      return status;
    }
    status[currentActive.index] = { k: currentActive.k, v: false };
    status.forEach((item) => {
      if (item.k === e.target.value) {
        item.v = true;
      }
    });
  };

  const onHandleUpdateOrder = async () => {
    try {
      const newOrder = order;
      newOrder.cart = cart;
      newOrder.status = status;
      newOrder.paymentMethod = paymentMethod;
      await putData(`order/update/${newOrder._id}`, { order: newOrder });
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: "Update order success",
      });
      onCloseOrderdetails();
      props.resetComponent(1);
    } catch (err) {
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: err.response.data.error,
      });
    }
  };

  const onCloseOrderdetails = () => {
    setShow(false);
    props.closeOrderDetails();
  };

  const getAccessToken = useCallback(() => {
    if (localStorage && localStorage.getItem("  ")) {
      setAccessToken(JSON.parse(localStorage.getItem("  ")));
    }
  }, []);

  const getOnChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };
  useEffect(() => {
    setPaymentMethod(props.order.paymentMethod);
    setCart(props.order.cart);
    setStatus(props.order.status);
    setOrder({
      _id: props.order._id,
      firstName: props.order.firstName,
      lastName: props.order.lastName,
      email: props.order.email,
      phoneNumber: props.order.phoneNumber,
      address: props.order.address,
      quantity: props.order.quantity,
      total: props.order.total,
      createDate: props.order.createDate,
    });
    setShow(props.show);
    getAccessToken();
    setViewOnly(props.viewOnly);
  }, [props.order, props.show]);
  return (
    <div className={"oder-details " + (show ? "" : "d-none")}>
      <div className="oder-details__header mb-3">
        <h2 className="text-center header__title">Order details</h2>
        <BsXSquare
          className="header__icon text-danger"
          onClick={onCloseOrderdetails}
        />
      </div>
      <div className="oder-details__content">
        <form className="order-details__infor">
          <div className="order-details__infor-item">
            <label>Order code: </label>
            <input
              type="text"
              name="_id"
              defaultValue={order._id}
              onChange={getOnChangeHandleInfor}
              disabled
            />
          </div>
          <div className="order-details__infor-item">
            <label>First name: </label>
            <input
              type="text"
              name="firstName"
              defaultValue={order.firstName}
              onChange={getOnChangeHandleInfor}
              disabled={
                getCurrentStatus(status) === "Shipping" ||
                getCurrentStatus(status) === "Cancel" ||
                getCurrentStatus(status) === "Success"
                  ? true
                  : viewOnly
              }
            />
          </div>
          <div className="order-details__infor-item">
            <label>Last name: </label>
            <input
              type="text"
              name="lastName"
              defaultValue={order.lastName}
              onChange={getOnChangeHandleInfor}
              disabled={
                getCurrentStatus(status) === "Shipping" ||
                getCurrentStatus(status) === "Cancel" ||
                getCurrentStatus(status) === "Success"
                  ? true
                  : viewOnly
              }
            />
          </div>
          <div className="order-details__infor-item">
            <label>Email: </label>
            <input
              type="email"
              name="email"
              defaultValue={order.email}
              onChange={getOnChangeHandleInfor}
              disabled={
                getCurrentStatus(status) === "Shipping" ||
                getCurrentStatus(status) === "Cancel" ||
                getCurrentStatus(status) === "Success"
                  ? true
                  : viewOnly
              }
            />
          </div>
          <div className="order-details__infor-item">
            <label>Phone number: </label>
            <input
              type="text"
              name="phoneNumber"
              defaultValue={order.phoneNumber}
              onChange={getOnChangeHandleInfor}
              disabled={
                getCurrentStatus(status) === "Shipping" ||
                getCurrentStatus(status) === "Cancel" ||
                getCurrentStatus(status) === "Success"
                  ? true
                  : viewOnly
              }
            />
          </div>
          <div className="order-details__infor-item">
            <label>Address: </label>
            <input
              type="text"
              name="address"
              defaultValue={order.address}
              onChange={getOnChangeHandleInfor}
              disabled={
                getCurrentStatus(status) === "Shipping" ||
                getCurrentStatus(status) === "Cancel" ||
                getCurrentStatus(status) === "Success"
                  ? true
                  : viewOnly
              }
            />
          </div>
          <div className="order-details__infor-item">
            <label>Total quantity: </label>
            <input
              type="number"
              name="quantity"
              value={order.quantity}
              disabled
            />
          </div>
          <div className="order-details__infor-item">
            <label>Total price: </label>
            <input
              type="text"
              name="total"
              value={PriceVnd(order.total)}
              disabled
            />
          </div>
        </form>
        <form className="order-details__status mb-3">
          <label>Status: </label>
          <select
            className="order-details__status"
            name="status"
            defaultValue={getCurrentStatus(status)}
            onChange={getOnChangeStatus}
            disabled={
              getCurrentStatus(status) === "Success" ||
              getCurrentStatus(status) === "Cancel"
                ? true
                : viewOnly
            }
          >
            {status &&
              status.map((item, index) => {
                return (
                  <option value={item.k} selected={item.v === true} key={index}>
                    {item.k}
                  </option>
                );
              })}
          </select>
        </form>
        <form className="order-details__status mb-3">
          <label>Payment method: </label>
          <select
            className="order-details__status"
            name="paymentMethod"
            defaultValue={paymentMethod}
            onChange={getOnChangePaymentMethod}
            disabled={
              getCurrentStatus(status) === "Shipping" ||
              getCurrentStatus(status) === "Cancel" ||
              getCurrentStatus(status) === "Success"
                ? true
                : viewOnly
            }
          >
            <option value={1}>COD</option>
            <option value={2}>Internet banking</option>
          </select>
        </form>
        <Table
          striped
          bordered
          hover
          className="order-details__product-table"
          size="sm"
        >
          <tbody>
            {cart &&
              cart.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={`${IMG_URL}/${item.image}`}
                        alt={`${item.title}-${item.attribute}`}
                      />
                    </td>
                    <td>
                      {item.title}-{item.attribute}
                    </td>
                    <td>{PriceVnd(item.price)}</td>
                    <td>{item.quantity}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <button
          className="btn btn-danger bg-danger w-100 mt-3 mb-2"
          onClick={onHandleUpdateOrder}
          disabled={
            getCurrentStatus(status) === "Success" ||
            getCurrentStatus(status) === "Cancel"
              ? true
              : viewOnly
          }
        >
          Update order
        </button>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => dispatch(action.setNotify(notify)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(orderDetails);
