import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/post.category.service.js";
import * as controller from "../controllers/post.category.controller.js";
import uploadSingle from "../middlewares/upload.single.js";
const router = express.Router();
const postCategoryRoutes = (app) => {
  //Create
  router.post(
    "/create",
    limitRequest,
    uploadSingle,
    service.create,
    controller.create
  );

  //Update
  router.patch(
    "/update/:id",
    limitRequest,
    uploadSingle,
    service.update,
    controller.update
  );

  //Delete
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deleteCategory,
    controller.deleteCategory
  );

  //Get all
  router.get("/", limitRequest, service.getAll);

  //Get by id
  router.get("/:url.:id", limitRequest, service.getById);
  return app.use("/api/v1/post-category", router);
};
export default postCategoryRoutes;
