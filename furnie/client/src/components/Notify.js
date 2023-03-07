import Toast from "react-bootstrap/Toast";
import { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

const Notify = ({ notify }) => {
  const [show, setShow] = useState(false);
  const [s, setS] = useState(3);

  //Set Second
  const setSecond = useCallback(() => {
    let x = 3;
    setS(x);
    setInterval(() => {
      if (x > 0) {
        x -= 1;
        setS(x);
      }
    }, 1000);
  }, []);

  //Get notify callback
  const getNotifyOption = useCallback(() => {
    if (notify) {
      if (notify.error || notify.success) {
        setShow(true);
      }
    } else {
      setShow(false);
    }
  }, [notify, notify.error]);

  //Use effect
  useEffect(() => {
    setSecond();
    getNotifyOption();
  }, [getNotifyOption]);
  //Render html
  return (
    <Toast
      className="notify"
      onClose={() => setShow(false)}
      show={show}
      delay={3500}
      autohide
    >
      <Toast.Header>
        <strong
          className={
            "me-auto" + (notify.error ? " text-danger" : " text-success")
          }
        >
          {notify.error ? "Error" : "Success"}
        </strong>
        <small>{s} seconds ago</small>
      </Toast.Header>
      <Toast.Body
        className={"text-light" + (notify.error ? " bg-danger" : " bg-success")}
      >
        {notify.message}
      </Toast.Body>
    </Toast>
  );
};
const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer.notify,
  };
};
export default connect(mapStateToProps)(Notify);
