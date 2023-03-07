import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";

// const { Formik } = ormik;

function FormExample() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    passsword: "",
  });
  const schema = yup.object().shape({
    // firstName: yup.string().required("First name is required"),
    // lastName: yup.string().required("Last name is required"),
    username: yup.string().required("username is required"),
    email: yup
      .string()
      .required("email is required")
      .email("email is in validate"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be min 6 charector"),
  });
  const getInput = (e) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const submitData = () => {
    console.log(values);
  };
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="validationFormikUsername2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              name="username"
              value={values.username}
              onChange={(e) => {
                getInput(e);
                handleChange(e);
              }}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="validationFormik102"
            className="position-relative"
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => {
                getInput(e);
                handleChange(e);
              }}
              onBlur={handleBlur}
              isInvalid={!!errors.email}
            />

            <Form.Control.Feedback type="invalid" tooltip>
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="validationFormik103"
            className="position-relative"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={values.password}
              onChange={(e) => {
                getInput(e);
                handleChange(e);
              }}
              onBlur={handleBlur}
              isInvalid={!!errors.password}
              isValid={touched.lastName && !errors.lastName}
            />

            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password}
            </Form.Control.Feedback>
            <Form.Control.Feedback type>Looks good!</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" onClick={submitData}>
            Submit form
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default FormExample;
