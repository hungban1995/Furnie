import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/order.service.js";
import * as controller from "../controllers/order.controller.js";
import validate from "../validations/order.validate.js";
const router = express.Router();
const orderRoutes = (app) => {
  //Create
  router.post(
    "/create",
    limitRequest,
    validate,
    service.create,
    controller.create
  );

  //Update
  router.put(
    "/update/:id",
    limitRequest,
    validate,
    service.update,
    controller.update
  );

  //Delete
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deleteOrder,
    controller.deleteOrder
  );

  //Get by user
  router.get("/user/:id", limitRequest, service.getByUser);

  //Get all
  router.get("/", limitRequest, service.getAll, controller.getAll);

  //Get by id
  router.get("/:id", limitRequest, service.getById);
  return app.use("/api/v1/order", router);
};
export default orderRoutes;
