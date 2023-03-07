import React, { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { getData, postData } from "../../libs/fetchData";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import EditUser from "./edit-user/updateUser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { connect } from "react-redux";
import MessageModal from "../../components/alert/messageModal";
import {
  getModal,
  getUserUpdate,
  setCount,
  setNotify,
} from "../../store/Action";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
const schema = yup
  .object({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();
function User(props) {
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const response = await getData("user");
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers, props.count]);

  // add user----------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  //- create user---------------------
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await postData("user/register", data);
      console.log(res);
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

  //update user-------------------------------

  const handClick = (user) => {
    props.setUpdateUserReducer({
      user: user,
      update: true,
    });
  };
  //- delete---
  const handClickDelete = (user) => {
    console.log(user);
    props.setModalReducer({
      show: true,
      deleteUser: true,
      message: "Do you want to delete this user",
      id: user._id,
    });
  };

  return (
    <div className="m-3">
      <div className="text-center">
        <h5>Manager User Page</h5>
        <p>This page: CRUD users</p>
      </div>
      <Row>
        <Col lg={5}>
          <div className="mb-3">
            <h5>Create new user:</h5>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="shadow p-2 rounded"
            >
              <label className="form-label">Username</label>
              <input
                className="form-control"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <p className="error-message">{errors.username.message}</p>
              )}
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
              <input
                className="btn btn-primary form-control mt-3"
                type="submit"
              />
            </form>
          </div>
        </Col>
        <Col lg={7}>
          <h5> All User</h5>
          <div
            className="table-responsive"
            style={{ height: "300px", overflow: "auto" }}
          >
            <Table className="table-fixed-header" bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ alignItems: "center", textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users ? (
                  users.map(function (user, idx) {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td
                          style={{ alignItems: "center", textAlign: "center" }}
                        >
                          <AiOutlineEdit
                            color="blue"
                            fontSize={25}
                            className="me-2"
                            onClick={() => {
                              handClick(user);
                            }}
                          />
                          <AiOutlineDelete
                            onClick={() => {
                              handClickDelete(user);
                            }}
                            color="red"
                            fontSize={25}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>Empty data...!</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <EditUser />
        </Col>
      </Row>
      <MessageModal />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    modal: state.ModalReducer.modal,
    notify: state.NotifyReducer,
    updateUser: state.UserReducer.updateUser,
    count: state.CounterReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
    },
    setUpdateUserReducer: (user) => {
      dispatch(getUserUpdate(user));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
