import express from "express";
import * as controller from "./test.attribute.controller.js";
const router = express.Router();
const testAttributeRoutes = (app) => {
  router.post("/create", controller.create);
  router.patch("/update/:id", controller.update);
  router.delete("/delete/:id", controller.update);
  router.get("/", controller.update);

  return app.use("/api/v1/test-attribute", router);
};
export default testAttributeRoutes;
