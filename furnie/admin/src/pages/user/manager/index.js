import { BiUpload } from "react-icons/bi";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getData, patchData } from "../../../libs/fetchData";
import { BlankAvatar } from "../../../images";
import { IMG_URL } from "../../../constants";
import { connect } from "react-redux";
import { setCount, setNotify } from "../../../store/Action";
import { useEffect, useState } from "react";
const schema = yup
  .object({
    username: yup.string(),
    password: yup.string(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords does not match"),
  })
  .required();

function Profile(props) {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    if (localStorage && localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      getData(`user/${user._id}`)
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [, props.count]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      root: currentUser.root,
    },
    mode: "all",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("username", currentUser.username);
    setValue("email", currentUser.email);
    setValue("role", currentUser.role);
    setValue("root", currentUser.root);
  }, [currentUser, setValue]);

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    try {
      const id = currentUser._id;
      if (data.avatar) {
        const fileList = [...data.avatar];
        fileList.forEach((item) => {
          formData.append("image", item);
        });
      } else formData.append("image", currentUser.avatar);

      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("root", data.root);
      formData.append("role", data.role);
      formData.append("confirmPassword", data.confirmPassword);

      const res = await patchData(`user/update/${id}`, formData);
      console.log(res);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setCount();
    } catch (error) {
      console.log(error);
      if (error && error.response) {
        props.setNotifyReducer({
          show: true,
          color: "bg-danger",
          notify: error.response.data.error,
        });
      }
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={handleSubmit(onSubmit)} className="user-manager-form">
        <div className="mb-2 user-avatar">
          <img
            className="user-avatar-img"
            src={
              currentUser && currentUser.avatar
                ? `${IMG_URL}/${currentUser.avatar}`
                : `${BlankAvatar}`
            }
            alt="avatar"
          />
          <span className="upload-icon-bg">
            <BiUpload className="user-icon" />
          </span>
          <input
            className="user-avatar-input"
            type="file"
            {...register("avatar")}
          />
        </div>
        <label className="form-label">Username</label>
        <input className="form-control" {...register("username")} />
        <p>{errors.username && <span>{errors.username.message}</span>}</p>
        <label className="form-label">Email</label>
        <input
          readOnly
          className="form-control bg-secondary bg-opacity-25"
          type="email"
          {...register("email")}
        />
        <label className="form-label">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <select className="form-control w-25" {...field}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
        />
        <div className="form-check my-2">
          <input
            className="form-check-input"
            type="checkbox"
            {...register("root")}
          />
          <label className="form-check-label">Root</label>
        </div>
        <label className="form-label">New Password</label>
        <input
          className="form-control"
          type="password"
          {...register("password")}
        />
        <p>{errors.password && <span>{errors.password.message}</span>}</p>
        <label className="form-label">Confirm Password</label>
        <input
          disabled={!password}
          className="form-control"
          type="password"
          {...register("confirmPassword")}
        />
        <p>
          {errors.confirmPassword && (
            <span>{errors.confirmPassword.message}</span>
          )}
        </p>
        <input className="btn btn-primary w-100" value="Update" type="submit" />
      </form>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    notifyReducer: state,
    userLogin: state.UserReducer.userLogin,
    count: state.CounterReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => dispatch(setNotify(notify)),
    setCount: () => {
      dispatch(setCount());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
