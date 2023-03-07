import express from "express";
import * as controller from "./test.product.controller.js";
const router = express.Router();
const testProductRoutes = (app) => {
  router.post("/create", controller.create);
  router.patch("/update/:id", controller.update);
  router.delete("/delete/:id", controller.update);
  router.get("/", controller.getAll);

  return app.use("/api/v1/test-product", router);
};
export default testProductRoutes;
