import { useEffect, useState, useCallback } from "react";
import { BsPencilSquare, BsEye } from "react-icons/bs";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import * as action from "../store/Action";
const UserOrderManagerItem = (props) => {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [payment, setPayment] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [orderCode, setOrderCode] = useState(null);
  const [itemIndex, setItemIndex] = useState(null);
  useEffect(() => {
    setStatus(props.status);
    setPayment(props.payment);
    setCreateDate(props.createDate);
    setOrderCode(props.orderCode);
    setItemIndex(props.itemIndex);
  }, [
    props.status,
    props.payment,
    props.createDate,
    props.orderCode,
    props.itemIndex,
  ]);
  const getCurrentStatus = useCallback(() => {
    const currentStatus = status
      ? status.filter((item) => item.v === true)
      : null;
    return currentStatus ? currentStatus[0].k : null;
  }, [status]);
  const onHandleViewOrderDetails = (orderId) => {
    props.getOrderId(orderId);
    router.push(`profile/order/${orderId}`);
  };
  const handleActiveEditOrder = (id) => {
    if (
      getCurrentStatus() === "Shipping" ||
      getCurrentStatus() === "Success" ||
      getCurrentStatus() === "Cancel"
    ) {
      return props.getNotify({
        error: true,
        message: `Can not edit when order is ${getCurrentStatus()}`,
      });
    }
    props.getOrderId(id);
    router.push(`/profile/order/edit/${id}`);
  };
  if (!status && !payment && !createDate && !orderCode && !itemIndex)
    return (
      <tr>
        <td colSpan={6}>Loading....</td>
      </tr>
    );
  return (
    <tr>
      <td className="text-center">{itemIndex}</td>
      <td>{orderCode}</td>
      <td className="text-center">{getCurrentStatus()}</td>
      <td className="text-center">
        {payment === 1 ? "COD" : "Internet banking"}
      </td>
      <td className="text-center">{createDate}</td>
      <td className="text-center">
        <BsPencilSquare
          className={
            "order--edit order__action " +
            (getCurrentStatus() === "Shipping" ||
            getCurrentStatus() === "Cancel" ||
            getCurrentStatus() === "Success"
              ? "disabled"
              : "")
          }
          title="Edit order"
          onClick={() => handleActiveEditOrder(orderCode)}
        />
        <BsEye
          className="order--details order__action"
          title="View order details"
          onClick={() => onHandleViewOrderDetails(orderCode)}
        />
      </td>
    </tr>
  );
};
const mapStateToProps = (state) => {
  return {};
};
const mapDisPatchToProps = (dispatch) => {
  return {
    getOrderId: (orderId) => {
      dispatch(action.getOrderId(orderId));
    },
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDisPatchToProps
)(UserOrderManagerItem);
