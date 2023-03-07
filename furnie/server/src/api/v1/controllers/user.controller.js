import _User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import redis from "../../../configs/redis.connect.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../helper/generateToken.js";
var salt = bcrypt.genSaltSync(10);

//----------Register----------//
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, salt);
    await _User.create({ username, email, password: hashPassword });
    res.status(200).json({
      success: "Register success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Login----------//
export const login = async (req, res, next) => {
  try {
    const { user } = req.body;
    const accessToken = createAccessToken({ _id: user._id });
    const refreshToken = createRefreshToken({ _id: user._id });
    await redis.set(user._id.toString(), refreshToken, "EX", 30 * 24 * 60 * 60);
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        root: user.root,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get users----------//
export const getUsers = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    const skipItem = (parseInt(page) - 1) * parseInt(pageSize);
    const users = await _User
      .find({}, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
      .skip(skipItem)
      .limit(pageSize);
    if (users.length === 0) {
      return next({
        status: 404,
        error: "No user found",
      });
    }
    res.status(200).json({
      success: "Get users success",
      users: users,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get user by id----------//
export const getUserById = async (req, res, next) => {
  try {
    const { user } = req.body;
    const { _id, username, email, role, root, avatar } = user;
    res.status(200).json({
      _id,
      username,
      email,
      role,
      root,
      avatar,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update user----------//
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, role, root } = req.body;
    const { oldUser } = req.body;
    const { avatar } = req.body;
    if (username) {
      if (username !== oldUser.username) {
        await _User.findByIdAndUpdate(id, { username: username });
      }
    }
    if (password) {
      const isMatch = bcrypt.compareSync(password, oldUser.password);
      if (!isMatch) {
        const newPassword = bcrypt.hashSync(password, salt);
        await _User.findByIdAndUpdate(id, { password: newPassword });
      }
    }
    if (role) {
      if (role !== oldUser.role) {
        await _User.findByIdAndUpdate(id, { role: role });
      }
    }
    if (root !== "" && root !== undefined && root !== null && root !== 0) {
      if (root !== oldUser.root) {
        await _User.findByIdAndUpdate(id, { root: root });
      }
    }
    await _User.findByIdAndUpdate(id, { avatar: avatar });
    res.status(200).json({
      success: "Update user success",
    });
  } catch (err) {
    console.log("service error: ", err);
    next(err);
  }
};

//----------Delete user----------//
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await _User.findById(id);
    if (!user) {
      return next({
        status: 404,
        error: "User does not exist",
      });
    }
    if (user.root && user.root === true) {
      return next({
        status: 404,
        error: "Can not delete this user",
      });
    }
    await _User.findByIdAndDelete(id);
    await redis.del(id);
    res.status(200).json({
      success: "Delete user success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Logout----------//
export const logout = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await redis.del(userId);
    res.status(200).json({
      success: "Loged out",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Refresh token----------//
export const refreshToken = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const accessToken = createAccessToken({ _id: userId.toString() });
    const refreshToken = createRefreshToken({ _id: userId.toString() });
    await redis.set(userId.toString(), refreshToken, "EX", 30 * 24 * 60 * 60);
    const user = await _User.findById(userId);
    const { _id, username, email, role, root, avatar } = user;
    res.status(200).json({
      accessToken,
      refreshToken,
      user: { _id, username, email, role, root, avatar },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
