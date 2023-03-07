import Col from "react-bootstrap/Col";
import { getData } from "../libs/fetchData";
import { useState, useEffect } from "react";
import { GET_ORDERS_BY_USER } from "../constants/index";
import Table from "react-bootstrap/Table";
import UserOrderManagerItem from "../components/UserOrderManagerItem";
import Pagination from "react-bootstrap/Pagination";
const UserOrderManager = (props) => {
  const [orders, setOrders] = useState(null);
  const [count, setCount] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(1);
  const [ordersPerPage, setOrdersPerpage] = useState(null);
  const [pageItems, setPageItems] = useState(null);
  useEffect(() => {
    if (props.accessToken && props.userId) {
      getData(`${GET_ORDERS_BY_USER}/${props.userId}`, props.accessToken)
        .then((res) => {
          setOrders(res.data.orders);
          setCount(res.data.count);
        })
        .catch(() => {
          setOrders([]);
        });
    }
  }, [props.userId, props.accessToken]);
  useEffect(() => {
    const end = page * limit;
    const start = end - limit;
    const ordersPerPage = orders && orders.slice(start, end);
    setOrdersPerpage(ordersPerPage);
  }, [orders, page]);
  useEffect(() => {
    const pageItems = [];
    const NumberOfPage = Math.ceil(count / limit);
    let i;
    for (i = 0; i < NumberOfPage; i++) {
      pageItems.push(i + 1);
    }
    setPageItems(pageItems);
  }, [count]);
  useEffect(() => {
    getIstimeOut();
  }, []);
  const getIstimeOut = () => {
    setTimeout(() => {
      setIsTimeout(true);
    }, 5000);
  };
  if (!ordersPerPage && !isTimeout)
    return (
      <Col md={6}>
        <div>Loading...</div>
      </Col>
    );
  if (!ordersPerPage && isTimeout)
    return (
      <Col md={6}>
        <div>No orders found</div>
      </Col>
    );
  return (
    <Col md={8} className="user-profile__orders">
      <div className="user-profile__orders-header mb-3 p-2">
        <h3 className="text-center">Your order</h3>
      </div>
      <Table
        striped
        bordered
        hover
        size="sm"
        className="mt-2 shadow"
        responsive="md"
      >
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Order code</th>
            <th className="text-center">Status</th>
            <th className="text-center">Payment method</th>
            <th className="text-center">Created date</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {ordersPerPage.map((item, index) => {
            return (
              <UserOrderManagerItem
                key={item._id}
                status={item.status}
                orderCode={item._id}
                createDate={item.createDate}
                payment={item.paymentMethod}
                itemIndex={index + 1}
              />
            );
          })}
        </tbody>
      </Table>
      <Pagination
        className={"shop__pagination " + (count === 0 ? "d-none" : "d-flex")}
      >
        <Pagination.Prev
          onClick={() => setPage(page - 1)}
          disabled={page === 1 ? true : false}
        />
        {pageItems &&
          pageItems.map((item) => {
            return (
              <Pagination.Item
                key={item}
                active={item === page}
                onClick={() => setPage(item)}
              >
                {item}
              </Pagination.Item>
            );
          })}
        <Pagination.Next
          onClick={() => setPage(page + 1)}
          disabled={page === Math.ceil(count / limit) ? true : false}
        />
      </Pagination>
    </Col>
  );
};
export default UserOrderManager;
