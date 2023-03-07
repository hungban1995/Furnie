import fs from "fs";
import path from "path";
const __dirname = path.resolve();

import { verifyAccessToken } from "../middlewares/auth.js";
export const getAll = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to view images labrary",
      });
    }
    const PATH = `${__dirname}/src/api/v1/public/uploads`;
    const imagesFolder = [];
    fs.readdirSync(PATH).forEach((folder) => {
      imagesFolder.push(folder);
    });
    const images = [];
    imagesFolder.forEach((item) => {
      fs.readdirSync(`${PATH}/${item}`).forEach((image) => {
        images.push(`uploads/${item}/${image}`);
      });
    });
    res.status(200).json({
      success: "Get images library success",
      images,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
