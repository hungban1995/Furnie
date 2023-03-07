import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./styles.css";
import { postData } from "../../libs/fetchData";
import { connect } from "react-redux";
import { refreshApp, setLoading, setNotify } from "../../store/Action";
import { useState, useEffect } from "react";
import NotifyPop from "../alert/notify";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

function Login(props) {
  const [resfreshToken, setRefreshToken] = useState(null);
  const [num, setNum] = useState(0);
  useEffect(() => {
    if (localStorage && localStorage.getItem("refreshToken")) {
      setRefreshToken(JSON.parse(localStorage.getItem("refreshToken")));
    }
  }, [num]);
  useEffect(() => {
    if (resfreshToken) {
      props.refreshApp();
    }
  }, [resfreshToken]);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all", resolver: yupResolver(schema) });

  //login-----

  const onSubmit = async (data) => {
    try {
      props.setLoading(true);
      const response = await postData("user/login", data);
      reset();
      if (response.data.user.role !== "admin") {
        props.setLoading(false);
        props.setNotifyReducer({
          show: true,
          color: "bg-danger",
          notify: "You do not permistion to Login",
        });
        return;
      }
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.accessToken)
      );
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(response.data.refreshToken)
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));

      props.setLoading(false);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: "Login success",
      });
      setNum(num + 1);
    } catch (error) {
      props.setLoading(false);

      console.log("login: ", error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };

  return (
    <div className="admin-login text-center text-white">
      <NotifyPop />

      <h2>Admin Login Page</h2>
      <form
        className="admin-login-form shadow p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="admin-login-form-label">Email</label>
        <input
          className="admin-login-form-input"
          {...register("email")}
          type="email"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
        <label className="admin-login-form-label">Password</label>
        <input
          className="admin-login-form-input"
          {...register("password")}
          type="password"
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
        <input
          className="admin-login-form-submit btn"
          type="submit"
          value="Login"
        />
      </form>
    </div>
  );
}
const mapStateToProps = (state) => {
  return { NotifyReducer: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => dispatch(setNotify(notify)),
    refreshApp: () => dispatch(refreshApp()),
    setLoading: (loading) => dispatch(setLoading(loading)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
