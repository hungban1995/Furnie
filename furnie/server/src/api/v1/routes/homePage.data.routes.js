import express from "express";
import * as service from "../services/page.manager.service.js";
import * as controller from "../controllers/page.manager.controller.js";
import limitRequest from "../middlewares/limitRequest.js";
const router = express.Router();
const homePageData = (app) => {
  router.post("/create", limitRequest, service.create, controller.create);
  router.patch("/update/:id", limitRequest, service.update, controller.update);
  router.get("/:id", limitRequest, service.getHomePage);
  return app.use("/api/v1/home-page", router);
};
export default homePageData;
