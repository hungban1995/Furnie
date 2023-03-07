/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { getData } from "../../libs/fetchData";
import * as action from "../../store/Action";
import Table from "react-bootstrap/Table";
import formatPrice from "../../libs/formatPrice";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import OrderDetails from "./details/index";
import { deleteData } from "../../libs/fetchData";
import { BsChevronBarRight, BsChevronBarLeft } from "react-icons/bs";
import "./order.styles.css";
const Orders = (props) => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [num, setNum] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumberList, setPageNumberList] = useState([]);
  const [queryStatus, setQueryStatus] = useState("");
  const [sortByDate, setSortByDate] = useState("");
  const [sortByPayment, setSortByPayment] = useState("");
  const [paymentList, setPaymentList] = useState(null);

  const getOrder = useCallback(async () => {
    try {
      const res = await getData(
        `order?page=${page}&&pageSize=${pageSize}&&status=${queryStatus}&&sort=${sortByDate}&&payment=${sortByPayment}`
      );
      setOrders(res.data.orders);
      setPageCount(Math.ceil(res.data.count / pageSize));
    } catch (err) {
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: err.response.data.error,
      });
    }
  }, [page, pageSize, queryStatus, sortByDate, sortByPayment]);
  const onHandleViewOrder = (item, viewOnly) => {
    setViewOnly(viewOnly);
    setOrder(item);
    setShowOrderDetails(!showOrderDetails);
  };
  const onHandleUpdateOrder = (item, viewOnly) => {
    setViewOnly(viewOnly);
    setOrder(item);
    setShowOrderDetails(!showOrderDetails);
  };
  const handleCloseOrderDetails = () => {
    setShowOrderDetails(!showOrderDetails);
  };
  const onHandleDeleteOrder = async (id) => {
    try {
      const res = await deleteData(`order/delete/${id}`);
      setNum(num + 1);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
    } catch (err) {
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: err.response.data.error,
      });
    }
  };

  const onHandleResetComponent = (newNum) => {
    setNum(num + newNum);
  };
  const getOrderStatus = (status) => {
    let currentStatus = [];
    currentStatus = status.filter((item) => item.v !== false);
    return currentStatus[0].k;
  };
  const changePage = (number) => {
    if (number === 1) {
      return setPage(page - 1);
    }
    if (number === 2) {
      return setPage(page + 1);
    }
  };
  const rederPageList = () => {
    const array = [];
    for (let i = 0; i < pageCount; i++) {
      array.push(i + 1);
    }
    setPageNumberList(array);
  };
  const onHandleSetPageSize = (e) => {
    if (e.target.value) {
      setPageSize(parseInt(e.target.value));
    }
  };
  const onChangeSortByDate = (e) => {
    setSortByDate(e.target.value);
  };
  const onChangeSortByStatus = (e) => {
    setQueryStatus(e.target.value);
  };
  const onChangeSortByPayment = (e) => {
    setSortByPayment(e.target.value);
  };
  useEffect(() => {
    rederPageList();
  }, [pageCount]);
  useEffect(() => {
    getOrder();
  }, [num, page, pageSize, queryStatus, sortByDate, sortByPayment]);
  useEffect(() => {
    const paymentList = [];
    orders.forEach((item) => {
      if (paymentList.length === 0) {
        paymentList.push(item.paymentMethod);
      } else {
        paymentList.forEach((method) => {
          if (item.paymentMethod !== method) {
            paymentList.push(item.paymentMethod);
          }
        });
      }
    });
    setPaymentList(paymentList);
  }, [orders]);
  const onHandleResetSort = () => {
    setPageSize(15);
    setQueryStatus("");
    setSortByDate("");
    setSortByPayment("");
  };
  if (orders.length === 0) return <div>No orders found</div>;
  return (
    <>
      <div className="order-manager__sort-container">
        <form className="order-manager__sort-form">
          <select
            name="pageSize"
            defaultValue={pageSize}
            onChange={onHandleSetPageSize}
          >
            <option value="">How many order to view</option>
            <option value={15}>15 order</option>
            <option value={30}>30 order</option>
            <option value={45}>45 order</option>
          </select>
        </form>
        <form className="order-manager__sort-form">
          <select
            name="status"
            value={queryStatus || ""}
            onChange={onChangeSortByStatus}
          >
            <option value="">Sort by status</option>
            {orders[0].status.map((item, index) => {
              return (
                <option value={item.k} key={index}>
                  {item.k}
                </option>
              );
            })}
          </select>
        </form>
        <form className="order-manager__sort-form">
          <select
            name="payment"
            value={sortByPayment || ""}
            onChange={onChangeSortByPayment}
          >
            <option value="">Sort by payment</option>
            {paymentList &&
              paymentList.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item === 1 ? "COD" : item === 2 ? "Internet banking" : ""}
                  </option>
                );
              })}
          </select>
        </form>
        <form className="order-manager__sort-form">
          <select
            name="sortByDate"
            value={sortByDate || ""}
            onChange={onChangeSortByDate}
          >
            <option value="">Sort by date</option>
            <option value={-1}>Latest</option>
            <option value={1}>Oldest</option>
          </select>
        </form>
        <button className="d-block" onClick={onHandleResetSort}>
          Reset
        </button>
      </div>
      <Table striped bordered hover responsive="md">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Order code</th>
            <th className="text-center">Quantity</th>
            <th className="text-center">Total</th>
            <th className="text-center">Status</th>
            <th className="text-center">Order date</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item._id}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">{formatPrice(item.total)}</td>
                  <td className="text-center">{getOrderStatus(item.status)}</td>
                  <td className="text-end">{item.createDate}</td>
                  <td className="text-center">
                    <span className="me-2 text-success">
                      <FiEdit
                        className="order-manager-action-icon"
                        onClick={() => onHandleUpdateOrder(item, false)}
                      />
                    </span>
                    <span className="me-2 text-info">
                      <FiEye
                        className="order-manager-action-icon"
                        onClick={() => onHandleViewOrder(item, true)}
                      />
                    </span>
                    <span className="text-danger">
                      <FiTrash
                        className="order-manager-action-icon"
                        onClick={() => onHandleDeleteOrder(item._id)}
                      />
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7}>No order found</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="order-manager__pagination">
        <button
          onClick={() => {
            changePage(1);
          }}
          disabled={page === 1 ? true : false}
        >
          <BsChevronBarLeft />
        </button>
        <ul className="mx-2 my-0">
          {pageNumberList.map((item) => {
            return (
              <li
                key={item}
                className={item === page ? "active" : ""}
                onClick={() => setPage(item)}
              >
                {item}
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => changePage(2)}
          disabled={page === pageCount ? true : false}
        >
          <BsChevronBarRight />
        </button>
      </div>
      <div
        className={
          "order-details__background " +
          (showOrderDetails ? "order-details__background--active" : "")
        }
      ></div>
      <OrderDetails
        viewOnly={viewOnly}
        order={order}
        show={showOrderDetails}
        closeOrderDetails={handleCloseOrderDetails}
        resetComponent={onHandleResetComponent}
      />
    </>
  );
};
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(action.setNotify(notify));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
