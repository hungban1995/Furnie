import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/product.category.service.js";
import * as controller from "../controllers/product.category.controller.js";
import uploadSingle from "../middlewares/upload.single.js";
const router = express.Router();
const productCategoryRoutes = (app) => {
  //----------Create----------//
  router.post(
    "/create",
    limitRequest,
    uploadSingle,
    service.create,
    controller.create
  );

  //----------Update----------//
  router.patch(
    "/update/:id",
    limitRequest,
    uploadSingle,
    service.update,
    controller.update
  );

  //----------Delete----------//
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deleteCategory,
    controller.deleteCategory
  );

  //----------Get all----------//
  router.get("/", limitRequest, service.getAll);

  //----------Get by id----------//
  router.get("/:id", limitRequest, service.getById);

  return app.use("/api/v1/product-category", router);
};
export default productCategoryRoutes;
