import _PostCategory from "../models/post.category.model.js";
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
        error: "You do not permistion to create post caetgory",
      });
    }
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "Upload file error",
      });
    }
    const { files } = req;
    if (files && files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      const image = `uploads/${dateTime}/${files[0].filename}`;
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
        error: "You do not permistion to create post caetgory",
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
    if (files && files.length > 0) {
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
        error: "You do not permistion to delete post category",
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
    const postCategorires = await _PostCategory
      .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
      .skip(skipItem)
      .limit(pageSize);
    if (postCategorires.length === 0) {
      return next({
        status: 404,
        error: "No category find",
      });
    }
    const categoriesList = [];
    postCategorires.forEach((item) => {
      categoriesList.push({
        category: item,
        link: {
          categoryDetails: `http://localhost:8080/api/v1/post-category/${item._id.toString()}`,
        },
      });
    });
    res.status(200).json({
      success: "Get categories success",
      data: categoriesList,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get by id----------//
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await _PostCategory.findById(id, {
      createAt: 0,
      updateAt: 0,
      __v: 0,
    });
    if (!category) {
      return next({
        status: 404,
        error: "Category not found",
      });
    }
    res.status(200).json({
      success: "Get category success",
      category,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
