import _Product from "../models/product.model.js";
import _ProductAttribute from "../models/product.attribute.model.js";
import _ProductCategory from "../models/product.category.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { format } from "date-fns";
import typeOf from "../helper/checkType.helper.js";
import { ObjectId } from "mongodb";

//----------Create----------//
export const create = async (req, res, next) => {
  console.log("product create service: ", req.body);
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to create product",
      });
    }
    let simpleProduct = true;
    let attributes = [];
    if (req.body.simpleProduct) {
      simpleProduct = JSON.parse(req.body.simpleProduct);
    }
    if (req.body.attributes) {
      attributes = JSON.parse(req.body.attributes);
    }
    if (attributes.length === 0) {
      simpleProduct = true;
      req.body.simpleProduct = true;
    }
    const newAttributes = [];
    if (!simpleProduct) {
      //Nếu sản phẩm không phải là sản phẩm đơn giản thì thực hiện các công việc sau
      for (let item of attributes) {
        //Dùng vòng lặp để kiểm tra xem các item trong mảng
        const itemType = typeOf(item);
        if (
          itemType === "Undefinded" ||
          itemType === "Number" ||
          itemType === "Boolean" ||
          itemType === "Array" ||
          itemType === "Null"
        ) {
          //Nếu các item thuộc kiểu dữ liệu trong danh sách thì sẽ báo về không hợp lệ
          return next({
            status: 400,
            error: "Invalid attribute type",
          });
        }
        if (itemType !== "String") {
          //Nếu kiểu dữ liệu của item không phải là string thì sẽ thực hiện tạo thuộc tính mới
          const data = await _ProductAttribute.create(item);
          newAttributes.push(data._id.toString());
        } else {
          //Nếu kiểu dữ liệu là string thì thực hiện việc thêm vào mảng
          newAttributes.push(item);
        }
        req.body.attributes = newAttributes;
      }
    } else {
      attributes.forEach((item) => {
        newAttributes.push(item);
      });
      req.body.simpleAttributes = newAttributes;
      req.body.attributes = [];
    }
    let categories = [];
    if (req.body.category) {
      categories = JSON.parse(req.body.category);
    }
    req.body.category = categories;
    const uploadError = req.fileValidationError;
    if (uploadError) {
      return next({
        status: 400,
        error: "Upload file error",
      });
    }
    const { files } = req;
    const images = [];
    if (files && files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      let image = "";
      files.forEach((item) => {
        image = `uploads/${dateTime}/${item.filename}`;
        images.push(image);
      });
      req.body.images = images;
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
        error: "You do not permistion to update product",
      });
    }
    let simpleProduct = true;
    let attributes = [];
    if (req.body.simpleProduct) {
      simpleProduct = JSON.parse(req.body.simpleProduct);
    }
    if (req.body.attributes) {
      attributes = JSON.parse(req.body.attributes);
    }
    if (attributes.length === 0) {
      simpleProduct = true;
      req.body.simpleProduct = true;
    }
    const newAttributes = [];
    if (!simpleProduct) {
      //Nếu không phải là sản phẩm đơn giản thì thực hiện các bước sau:
      for (let item of attributes) {
        const itemType = typeOf(item);
        if (
          itemType === "Undefinded" ||
          itemType === "Number" ||
          itemType === "Boolean" ||
          itemType === "Array" ||
          itemType === "Null"
        ) {
          //Nếu item là 1 trong các kiểu dữ liệu trong danh sách thì sẽ thông báo là không hợp lệ
          return next({
            status: 400,
            error: "Invalid attribute type",
          });
        }
        if (itemType !== "String") {
          //Nếu kiểu dữ liệu của item không phải là string thì thực hiện tạo 1 attributes mới
          const data = await _ProductAttribute.create(item);
          newAttributes.push(data._id.toString());
        } else {
          //Nếu kiểu dữ liệu của item là string thì thêm vào mảng
          newAttributes.push(item);
        }
        req.body.attributes = newAttributes;
      }
    } else {
      attributes.forEach((item) => {
        newAttributes.push(item);
      });
      req.body.simpleAttributes = newAttributes;
      req.body.attributes = [];
    }
    let categories = [];
    if (req.body.category) {
      categories = JSON.parse(req.body.category);
    }
    req.body.category = categories;
    const uploadError = req.fileValidationError;
    if (uploadError) {
      return next({
        status: 400,
        error: "Upload file error",
      });
    }
    const { files } = req;
    const images = [];
    if (files && files.length > 0) {
      const dateTime = format(new Date(), `MM-yyyy`);
      let image = "";
      files.forEach((item) => {
        image = `uploads/${dateTime}/${item.filename}`;
        images.push(image);
      });
      req.body.images = images;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deleteProduct = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to delete product",
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
    const count = await _Product.find({}).count();
    const products = await _Product
      .find({})
      .populate({ path: "category", select: "title" })
      .populate({
        path: "attributes",
        select: "-createdAt -updatedAte -__v",
        populate: { path: "product", select: "title url" },
      });
    if (products.length === 0) {
      return next({
        status: 404,
        error: "No product found",
      });
    }
    res.status(200).json({
      success: "Get products success",
      count,
      products,
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
    const simpleProduct = await _Product
      .findOne(
        {
          _id: ObjectId(id),
          simpleProduct: true,
        },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      )
      .populate({ path: "category", select: "title url" });
    if (simpleProduct) {
      return res.status(200).json({
        success: "Get product success",
        product: simpleProduct,
      });
    }
    const manyVariationsProduct = await _Product
      .findOne(
        { _id: ObjectId(id), simpleProduct: false },
        {
          sku: 0,
          price: 0,
          onSale: 0,
          inStock: 0,
          sold: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      )
      .populate({ path: "category", select: "title url" })
      .populate({
        path: "attributes",
        select: "-createdAt -updatedAt -__v",
      });
    if (!manyVariationsProduct) {
      return next({
        status: 404,
        error: "No product found",
      });
    }
    res.status(200).json({
      success: "Get product success",
      product: manyVariationsProduct,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get by product category----------//
export const getProductByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await _ProductCategory.findById(id, {
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
    const productByCategory = await _Product
      .find({
        category: { $eq: id },
      })
      .populate({
        path: "attributes",
        select: "-createdAt -updatedAte -__v",
        populate: { path: "product", select: "title url" },
      });
    if (productByCategory.length === 0) {
      return next({
        status: 404,
        error: "No product found",
      });
    }
    const count = await _Product
      .find({
        category: { $eq: id },
      })
      .count();
    res.status(200).json({
      success: "Get product success",
      productByCategory,
      category,
      count,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
