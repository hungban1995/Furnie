import React from "react";
import { patchData } from "../../../libs/fetchData";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as yup from "yup";

import { connect } from "react-redux";
import { getUserUpdate, setCount, setNotify } from "../../../store/Action";
import { Formik } from "formik";
import Button from "react-bootstrap/esm/Button";

const schema = yup
  .object({
    username: yup.string().required(),
  })
  .required();

function EditUser(props) {
  const user = props.updateUser.user;

  const handleSubmit = async (values) => {
    const formData = new FormData();
    console.log(values);
    try {
      const id = user._id;
      formData.append("image", user.avatar);
      formData.append("username", values.username);
      formData.append("email", values.email);

      formData.append("root", values.root);
      formData.append("role", values.role);
      const res = await patchData(`user/update/${id}`, formData);
      console.log(res);
      props.setUpdateUserReducer({
        update: false,
        user: { _id: "", username: "", email: "", role: "", root: false },
      });
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setCount();
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };
  return (
    <Modal
      onHide={() => {
        props.setUpdateUserReducer({
          update: false,
          user: { _id: "", username: "", email: "", role: "", root: false },
        });
      }}
      show={props.updateUser.update}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            username: user.username,
            email: user.email,
            role: user.role,
            root: user.root,
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="role">Role</Form.Label>
                <Form.Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  checked={values.root}
                  type="switch"
                  label="Root"
                  name="root"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                className="form-control btn btn-primary mt-3"
                type="submit"
              >
                Update
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
const mapStateToProps = (state) => {
  return {
    count: state.CounterReducer,
    notify: state.NotifyReducer,
    updateUser: state.UserReducer.updateUser,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },

    setUpdateUserReducer: (user) => {
      dispatch(getUserUpdate(user));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
