import express from "express";
import limitRequest from "../middlewares/limitRequest.js";
import * as service from "../services/product.review.service.js";
const router = express.Router();
const productReviewRoutes = (app) => {
  //Create
  router.post("/create", limitRequest, service.create);

  //Update
  router.patch("/update/:id", limitRequest, service.update);

  //Delete
  router.delete("/delete/:id", limitRequest, service.deleteProductReview);

  //Get by product
  router.get("/by-product", limitRequest, service.getByProduct);

  //Get all
  router.get("/", limitRequest, service.getAll);

  //Get by id
  router.get("/:id", limitRequest, service.getById);
  return app.use("/api/v1/product-review", router);
};
export default productReviewRoutes;
