import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import uploadSingle from "../middlewares/upload.single.js";
import * as service from "../services/product.attribute.service.js";
import * as controller from "../controllers/product.attribute.controller.js";
import { productAttributeValidate } from "../validations/product.validate.js";
const router = express.Router();
const productAttributeRoutes = (app) => {
  //Create
  router.post(
    "/create",
    limitRequest,
    uploadSingle,
    productAttributeValidate,
    service.create,
    controller.create
  );

  //Update
  router.patch(
    "/update/:id",
    limitRequest,
    uploadSingle,
    productAttributeValidate,
    service.update,
    controller.update
  );

  //Delete
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deleteProductAttribute,
    controller.deleteProductAttribute
  );

  //   //Get all
  //   router.get("/", limitRequest);

  //   //Get by id
  //   router.get("/:id", limitRequest);
  return app.use("/api/v1/product-attribute", router);
};
export default productAttributeRoutes;
