import _ProductAttribute from "../models/product.attribute.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { format } from "date-fns";

//----------Create----------//
export const create = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to create product attribute",
      });
    }
    let values = [];
    if (req.body.values) {
      values = JSON.parse(req.body.values);
    }
    req.body.values = values;
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "File upload error",
      });
    }
    const { files } = req;
    if (files && files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      req.body.image = `uploads/${dateTime}/${files[0].filename}`;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update----------//
export const update = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to update product attribute",
      });
    }
    let values = [];
    if (req.body.values) {
      values = JSON.parse(req.body.values);
    }
    req.body.values = values;
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "File upload error",
      });
    }
    const { files } = req;
    if (files && files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      req.body.image = `uploads/${dateTime}/${files[0].filename}`;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deleteProductAttribute = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to delete product attribute",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
