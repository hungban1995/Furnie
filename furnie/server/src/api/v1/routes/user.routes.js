import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/user.service.js";
import * as controller from "../controllers/user.controller.js";
import * as validate from "../validations/user.validate.js";
import uploadSingle from "../middlewares/upload.single.js";
const router = express.Router();
const userRoutes = (app) => {
  //Register api
  router.post(
    "/register",
    limitRequest,
    validate.register,
    service.register,
    controller.register
  );
  //Login api
  router.post(
    "/login",
    limitRequest,
    validate.login,
    service.login,
    controller.login
  );
  //Get all user
  router.get("/", limitRequest, service.getUsers, controller.getUsers);
  //Get user by id
  router.get("/:id", limitRequest, service.getUserById, controller.getUserById);
  //Update user
  router.patch(
    "/update/:id",
    limitRequest,
    uploadSingle,
    service.updateUser,
    controller.updateUser
  );
  //Delete user
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deleteUser,
    controller.deleteUser
  );
  //Logout
  router.post("/logout", limitRequest, service.logout, controller.logout);
  //Refresh token
  router.post(
    "/refresh-token",
    limitRequest,
    service.refreshToken,
    controller.refreshToken
  );
  return app.use("/api/v1/user", router);
};
export default userRoutes;
