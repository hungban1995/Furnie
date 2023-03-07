import _Product from "../models/product.model.js";
import _ProductAttribute from "../models/product.attribute.model.js";
import typeOf from "../helper/checkType.helper.js";

//----------Create----------//
export const create = async (req, res, next) => {
  try {
    console.log(req.body);
    let { simpleProduct, attributes } = req.body;
    if (typeOf(simpleProduct) === "String") {
      simpleProduct = JSON.parse(req.body.simpleProduct);
    }
    if (simpleProduct) {
      //Tạo sản phẩm đơn giản
      await _Product.create(req.body);
      return res.status(200).json({
        success: "Create product success",
      });
    }
    const newProduct = await _Product.create(req.body);
    for (let item of attributes) {
      await _ProductAttribute.findByIdAndUpdate(item, {
        product: newProduct._id,
      });
    }
    res.status(200).json({
      success: "Create product success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update----------//
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await _Product.findById(id);
    if (!product) {
      return next({
        status: 404,
        error: "Product not found",
      });
    }
    let { simpleProduct, attributes } = req.body;
    if (typeOf(simpleProduct) === "String") {
      simpleProduct = JSON.parse(req.body.simpleProduct);
    }
    if (simpleProduct) {
      //Update sản phẩm đơn giản
      await _Product.findByIdAndUpdate(id, req.body);
      return res.status(200).json({
        success: "Update product success",
      });
    }
    const updatedProduct = await _Product.findByIdAndUpdate(id, req.body);
    for (let item of attributes) {
      await _ProductAttribute.findByIdAndUpdate(item, {
        product: updatedProduct._id,
      });
    }
    res.status(200).json({
      success: "Update product success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await _Product.findById(id);
    if (!product) {
      return next({
        status: 404,
        error: "Product has been delete or does not exist",
      });
    }
    const { simpleProduct, attributes } = product;
    if (!simpleProduct) {
      let item;
      for (item of attributes) {
        await _ProductAttribute.findByIdAndDelete(item);
      }
    }
    await _Product.findByIdAndDelete(id);
    res.status(200).json({
      success: "Delete product success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
