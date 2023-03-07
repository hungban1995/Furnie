import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/post.comment.service.js";
const router = express.Router();
const postCommentRoutes = (app) => {
  //Create
  router.post("/create", limitRequest, service.create);

  //Update
  router.patch("/update/:id", limitRequest, service.update);

  //Delete
  router.delete("/delete/:id", limitRequest, service.deletePostComment);

  //Get comment
  router.get("/", limitRequest, service.getByPost);

  return app.use("/api/v1/post-comment", router);
};
export default postCommentRoutes;
