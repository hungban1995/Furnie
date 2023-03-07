import _User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/auth.js";
import redis from "../../../configs/redis.connect.js";
import { format } from "date-fns";
//----------Register----------//
export const register = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userByEmail = await _User.findOne({ email: email });
    if (userByEmail) {
      return next({
        status: 400,
        error: "Email already exist",
      });
    }
    const userByUsername = await _User.findOne({ username: username });
    if (userByUsername) {
      return next({
        status: 400,
        error: "Username already exist",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Login----------//
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await _User.findOne({ email: email });
    if (!user) {
      return next({
        status: 404,
        error: "User does not exist",
      });
    }
    const matchPassword = bcrypt.compareSync(password, user.password);
    if (!matchPassword) {
      return next({
        status: 400,
        error: "Incorect password",
      });
    }
    req.body.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Get user----------//
export const getUsers = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not have permistion to view all user",
      });
    } else next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Get user by id----------//
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userById = await _User.findById(id);
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (
      decode.role !== "admin" &&
      userById._id.toString() !== decode._id.toString()
    ) {
      return next({
        status: 403,
        error: "You do not permistion to view this user's profile",
      });
    }
    req.body.user = userById;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Update user----------//
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, role, root, password, confirmPassword } = req.body;
    const userById = await _User.findById(id);
    const userByUsername = await _User.findOne({ username: username });
    if (!userById) {
      return next({
        status: 404,
        error: "User does not exist",
      });
    }
    if (
      userByUsername &&
      userByUsername._id.toString() !== userById._id.toString()
    ) {
      return next({
        status: 400,
        error: "User name already exist",
      });
    }
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (
      userById._id.toString() !== decode._id.toString() &&
      decode.role !== "admin"
    ) {
      return next({
        status: 403,
        error: "You do not permistion to update user",
      });
    }
    if (email !== userById.email) {
      return next({
        status: 400,
        error: "Email can not change",
      });
    }

    if (role) {
      if (userById.role !== role && decode.role !== "admin") {
        return next({
          status: 403,
          error: "You do not permistion to change user's role",
        });
      }
    }
    if (root !== "" && root !== undefined && root !== null && root !== 0) {
      if (userById.root.toString() !== root && decode.role !== "admin") {
        return next({
          status: 403,
          error: "You do not permistion to change user's root",
        });
      }
    }
    if (!username) {
      return next({
        status: 400,
        error: "Invalid username",
      });
    }
    if (password && password !== confirmPassword) {
      return next({
        status: 400,
        error: "Password and confirm password is not match",
      });
    }
    if (password && password.length < 6) {
      return next({
        status: 400,
        error: "Password must be min 6 charector",
      });
    }
    const uploadError = req.fileValidationError;
    if (uploadError) {
      return next({
        status: 400,
        error: "File upload error",
      });
    }
    const { files } = req;
    if (files && files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      req.body.avatar = `uploads/${dateTime}/${files[0].filename}`;
    }
    req.body.oldUser = userById;
    next();
  } catch (err) {
    console.log("service error: ", err);
    next(err);
  }
};
//----------Delete user----------//
export const deleteUser = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to delete user",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Logout----------//
export const logout = async (req, res, next) => {
  try {
    const decode = await verifyRefreshToken(req);
    if (decode.error) {
      return next(decode);
    }
    req.body.userId = decode._id;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Refresh token----------//
export const refreshToken = async (req, res, next) => {
  try {
    const decode = await verifyRefreshToken(req);
    if (decode.error) {
      return next(decode);
    }
    await redis.del(decode._id.toString());
    req.body.userId = decode._id;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
