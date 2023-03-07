import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/product.service.js";
import * as controller from "../controllers/product.controller.js";
import uploadMultiple from "../middlewares/upload.multiple.js";
import { validate } from "../validations/product.validate.js";
const router = express.Router();
const productRoutes = (app) => {
  //----------Create----------//
  router.post(
    "/create",
    limitRequest,
    uploadMultiple,
    validate,
    service.create,
    controller.create
  );

  //----------Update----------//
  router.patch(
    "/update/:id",
    limitRequest,
    uploadMultiple,
    validate,
    service.update,
    controller.update
  );

  //----------Delete----------//
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deleteProduct,
    controller.deleteProduct
  );

  //----------Get all----------//
  router.get("/", limitRequest, service.getAll);

  //----------Get by id----------//
  router.get("/:url.:id", limitRequest, service.getById);

  router.get("/category/:url.:id", limitRequest, service.getProductByCategory);

  return app.use("/api/v1/product", router);
};
export default productRoutes;
