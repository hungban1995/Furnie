import { connect } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect } from "react";

const Loading = ({ loading }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(loading);
  }, [loading]);
  return (
    <>
      <div className={"loading " + (show ? "d-block" : "d-none")}>
        <div className="loading__spinner-container">
          <div className="loading__spinner-top">
            <Spinner
              animation="border"
              variant="info"
              className="loading__spinner-icon"
            />
          </div>
          <div className="loading__spinner-bottom mt-3">
            <span className="loading__spinner-text text-light">Loading</span>
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon"
            />
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    loading: state.LoadingReducer.loading,
  };
};
export default connect(mapStateToProps)(Loading);
