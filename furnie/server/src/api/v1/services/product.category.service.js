import _productCategory from "../models/product.category.model.js";
import _Product from "../models/product.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { format } from "date-fns";

//----------Create category----------//
export const create = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to create category",
      });
    }
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "Upload file error",
      });
    }
    const { files } = req;
    let image = "";
    if (files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      image = `uploads/${dateTime}/${files[0].filename}`;
      req.body.image = image;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update category----------//
export const update = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to update category",
      });
    }
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "Upload file error",
      });
    }
    const { files } = req;
    console.log(files);
    let image = "";
    if (files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      image = `uploads/${dateTime}/${files[0].filename}`;
      req.body.image = image;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete category----------//
export const deleteCategory = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to delete category",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get all category----------//
export const getAll = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    const skipItem = (parseInt(page) - 1) * parseInt(pageSize);
    const categories = await _productCategory
      .find(
        {},
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      )
      .skip(skipItem)
      .limit(pageSize);

    if (categories.length === 0) {
      return next({
        status: 404,
        error: "No category found",
      });
    }
    const categoriesList = [];
    categories.forEach((item) => {
      categoriesList.push({
        category: item,
        link: {
          categoryDetails: `http://localhost:8080/api/v1/category/${item._id.toString()}`,
        },
      });
    });
    res.status(200).json({
      success: "Get categories success",
      categories: categoriesList,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get category----------//
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await _productCategory.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!category) {
      return next({
        status: 404,
        error: "Category not found",
      });
    }
    res.status(200).json({ success: "Get category success", category });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
