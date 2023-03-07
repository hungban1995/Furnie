import React from "react";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { BiBell } from "react-icons/bi";
import { connect } from "react-redux";
import { setNotify } from "../../../store/Action";

function NotifyPop(props) {
  return (
    <ToastContainer className="toast-message-custom">
      <Toast
        className={props.notify?.color}
        onClose={() => props.setNotifyReducer({ show: false })}
        show={props.notify?.show}
        delay={3000}
        autohide
      >
        <Toast.Header closeButton={true}>
          <strong className="me-auto">Furnie</strong>
          <BiBell />
        </Toast.Header>
        <Toast.Body>
          <p>{props.notify?.notify}</p>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
const mapStateToProps = (state) => {
  return { notify: state.NotifyReducer.notify };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => dispatch(setNotify(notify)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotifyPop);
