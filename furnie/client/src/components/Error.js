import Container from "react-bootstrap/Container";
import { useState, useEffect, useCallback } from "react";
const Error = (props) => {
  const [error, setError] = useState({
    status: "",
    message: "",
  });

  //Get error message
  const getMessage = useCallback(() => {
    return new Promise((resolve, reject) => {
      resolve({
        status: props.status,
        message: props.message,
      });
      reject({
        status: "",
        message: "",
      });
    });
  }, []);

  //Use effect
  useEffect(() => {
    getMessage()
      .then((data) => setError(data))
      .catch((err) => setError(err));
  }, [props.error]);
  return (
    <Container>
      <p
        className="text-center"
        style={{
          fontSize: "75px",
          textTransform: "uppercase",
          fontWeight: "700",
        }}
      >
        {error.status}
      </p>
      <p className="text-center">{error.message}</p>
    </Container>
  );
};
export default Error;
