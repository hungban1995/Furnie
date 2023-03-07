import express from "express";
import * as service from "../services/image.lib.service.js";
const router = express.Router();
const imageRoutes = (app) => {
  router.get("/", service.getAll);
  return app.use("/api/v1/image-library", router);
};
export default imageRoutes;
