import express from "express";
import * as controller from "./test.attributeType.controller.js";
const router = express.Router();
const testAttributeTypeRoutes = (app) => {
  router.post("/create", controller.create);
  router.patch("/update/:id", controller.update);
  router.delete("/delete/:id", controller.update);
  router.get("/", controller.update);

  return app.use("/api/v1/test-attribute-type", router);
};
export default testAttributeTypeRoutes;
