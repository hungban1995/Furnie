import React from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteData } from "../../libs/fetchData";
import { getModal, setCount, setNotify } from "../../store/Action";

function MessageModal(props) {
  const handleClose = () => props.setModalReducer({ show: false });
  const handleSumit = async () => {
    try {
      if (props.modal && props.modal.deleteUser) {
        await deleteData(`user/delete/${props.modal.id}`);
      } else if (props.modal && props.modal.deleteCategory) {
        await deleteData(`product-category/delete/${props.modal.id}`);
      } else if (props.modal && props.modal.deleteProduct) {
        await deleteData("product/delete/" + props.modal.id);
      } else if (props.modal && props.modal.deletePostCategory) {
        await deleteData(`post-category/delete/${props.modal.id}`);
      } else if (props.modal && props.modal.deleteAttribute) {
        await deleteData(`product-attribute/delete/${props.modal.id}`);
      } else if (props.modal && props.modal.deletePost) {
        await deleteData(`post/delete/${props.modal.id}`);
      }
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: "Delete success",
      });
      props.setModalReducer({ show: false });
      props.setCount();
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
      props.setModalReducer({ show: false });
    }
  };
  return (
    <Modal
      show={props.modal.show}
      onHide={() => {
        props.setModalReducer({ show: false });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.modal.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSumit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
const mapStateToProps = (state) => {
  return {
    modal: state.ModalReducer.modal,
    notify: state.NotifyReducer,
    count: state.CounterReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
    },

    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageModal);
