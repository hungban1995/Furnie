import _Post from "../models/post.model.js";
import _Categories from "../models/post.category.model.js";
import { format } from "date-fns";
import { verifyAccessToken } from "../middlewares/auth.js";

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
        error: "You do not permistion to create post",
      });
    }
    let categories = [];
    if (req.body.category) {
      categories = JSON.parse(req.body.category);
    }
    req.body.category = categories;
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "Upload file error",
      });
    }
    const { title } = req.body;
    if (!title) {
      return next({
        status: 400,
        error: "Titile can not empty",
      });
    }
    const { files } = req;
    if (files && files.length > 0) {
      const images = [];
      const dateTime = format(new Date(), "MM-yyyy");
      files.forEach((item) => {
        images.push(`uploads/${dateTime}/${item.filename}`);
      });
      req.body.images = images;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------update----------//
export const update = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to update post",
      });
    }
    let categories = [];
    if (req.body.category) {
      categories = JSON.parse(req.body.category);
    }
    req.body.category = categories;
    const { title } = req.body;
    if (!title) {
      return next({
        status: 400,
        error: "Title can not empty",
      });
    }
    if (req.fileValidationError) {
      return next({
        status: 400,
        error: "File upload error",
      });
    }
    const { files } = req;
    const images = [];
    if (files && files.length > 0) {
      const dateTime = format(new Date(), "MM-yyyy");
      files.forEach((item) => {
        images.push(`uploads/${dateTime}/${item.filename}`);
      });
      req.body.images = images;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------delete----------//
export const deletePost = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permisrion to delete post",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get all----------//
export const getAll = async (req, res, next) => {
  try {
    const posts = await _Post
      .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({ path: "category", select: "title" })
      .populate({ path: "author", select: "username" });
    if (posts.length === 0) {
      return next({
        status: 404,
        error: "No post found",
      });
    }
    const count = await _Post
      .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
      .count();
    const postList = [];
    posts.forEach((item) => {
      postList.push({
        item,
        link: { postDetails: `http://localhost:8080/api/v1/post/${item.id}` },
      });
    });
    res.status(200).json({
      success: "Get post success",
      posts: postList,
      count,
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
    const post = await _Post
      .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({ path: "category", select: "title" })
      .populate({ path: "author", select: "username" });
    if (!post) {
      return next({
        status: 404,
        error: "Post not found",
      });
    }
    res.status(200).json({
      success: "Get post success",
      post,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get by id----------//
export const getByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await _Categories.findById(id);
    if (!category) {
      return next({
        status: 404,
        error: "No post category found",
      });
    }
    const postByCategory = await _Post
      .find({ category: id }, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({ path: "author", select: "username avatar" })
      .populate({ path: "category", select: "title url" });

    if (postByCategory.length === 0) {
      return next({
        status: 404,
        error: "No post by category found",
      });
    }
    const count = await _Post
      .find({ category: id }, { createdAt: 0, updatedAt: 0, __v: 0 })
      .count();
    const postList = [];
    postByCategory.forEach((item) => {
      postList.push({
        item,
        link: {
          postDetails: `http://localhost:8080/api/v1/post/${item.id}`,
        },
      });
    });
    res.status(200).json({
      success: "Get post by category success",
      posts: postList,
      count,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
