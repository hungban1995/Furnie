import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import uploadMultiple from "../middlewares/upload.multiple.js";
import * as service from "../services/post.service.js";
import * as controller from "../controllers/post.controller.js";
const router = express.Router();
const postRoutes = (app) => {
  //Create
  router.post(
    "/create",
    limitRequest,
    uploadMultiple,
    service.create,
    controller.create
  );

  //Update
  router.patch(
    "/update/:id",
    limitRequest,
    uploadMultiple,
    service.update,
    controller.update
  );

  //Delete
  router.delete(
    "/delete/:id",
    limitRequest,
    service.deletePost,
    controller.deletePost
  );

  //Get all
  router.get("/", limitRequest, service.getAll);

  //Get by id
  router.get("/:url.:id", limitRequest, service.getById);

  //Get by category
  router.get("/get-by-category/:url.:id", limitRequest, service.getByCategory);

  return app.use("/api/v1/post", router);
};
export default postRoutes;
