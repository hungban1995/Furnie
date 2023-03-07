import _HomepageData from "../models/homePage.data.model.js";
import _Product from "../models/product.model.js";
import _Category from "../models/product.category.model.js";
import _Post from "../models/post.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";
export const create = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 404,
        error: "You do not permistion to create page",
      });
    }
    const { products, categories, posts } = req.body;
    if (products && products.length > 0) {
      let item;
      for (item of products) {
        const product = await _Product.findById(item);
        if (!product) {
          return next({
            status: 404,
            error: "Some product not found",
          });
        }
      }
    }
    if (categories && categories.length > 0) {
      if (posts.length > 5) {
        return next({
          status: 400,
          error: "Maximum 5 post to set in homepage",
        });
      }
      let item;
      for (item of categories) {
        const category = await _Category.findById(item);
        if (!category) {
          return next({
            status: 404,
            error: "Some product not found",
          });
        }
      }
    }
    if (posts && posts.length > 0) {
      if (posts.length > 6) {
        return next({
          status: 400,
          error: "Maximum 6 post to set in homepage",
        });
      }
      let item;
      for (item of posts) {
        const post = await _Post.findById(item);
        if (!post) {
          return next({
            status: 404,
            error: "Some post not found",
          });
        }
      }
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to edit page",
      });
    }
    const { id } = req.params;
    const page = await _HomepageData.findById(id);
    if (!page) {
      return next({
        status: 404,
        error: "Page not found",
      });
    }
    const { products, categories, posts } = req.body;
    if (products && products.length > 0) {
      if (products.length > 4) {
        return next({
          status: 400,
          error: "Maximum 4 product to set in home page",
        });
      }
      let item;
      for (item of products) {
        const product = await _Product.findById(item);
        if (!product) {
          return next({
            status: 404,
            error: "Some product not found",
          });
        }
      }
    }
    if (categories && categories.length > 0) {
      if (categories.length > 5) {
        return next({
          status: 400,
          error: "Maximum 5 category to set in homepage",
        });
      }
      let item;
      for (item of categories) {
        const category = await _Category.findById(item);
        if (!category) {
          return next({
            status: 404,
            error: "Some category not found",
          });
        }
      }
    }
    if (posts && posts.length > 0) {
      if (posts.length > 6) {
        return next({
          status: 400,
          error: "Maximum 6 post to set in homepage",
        });
      }
      let item;
      for (item of posts) {
        const post = await _Post.findById(item);
        if (!post) {
          return next({
            status: 404,
            error: "Some post not found",
          });
        }
      }
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getHomePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const homePageData = await _HomepageData
      .findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate({
        path: "products",
        select: "-createdAt -updatedAt -__v",
        populate: { path: "attributes", select: "-createdAt -updatedAt -__v" },
      })
      .populate({ path: "categories", select: "title url image" })
      .populate({
        path: "posts",
        select: "title description createdDate url images",
      });
    if (!homePageData) {
      return next({
        status: 404,
        error: "Home page data not found",
      });
    }
    res.status(200).json({
      success: "Get homepage success",
      homePageData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
