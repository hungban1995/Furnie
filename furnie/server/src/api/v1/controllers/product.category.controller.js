import _productCategory from "../models/product.category.model.js";

//----------Create category----------//
export const create = async (req, res, next) => {
  try {
    await _productCategory.create(req.body);
    res.status(200).json({
      success: "Create category success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update category----------//
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await _productCategory.findById(id);
    if (!category) {
      return next({
        status: 404,
        error: "Category not found",
      });
    }
    const { title, content, description, url, image } = req.body;
    await _productCategory.findByIdAndUpdate(id, {
      title: title,
      content: content,
      description: description,
      url: url,
      image: image,
    });
    res.status(200).json({
      success: "Update category success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete category----------//
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await _productCategory.findById(id);
    if (!category) {
      return next({
        status: 404,
        error: "Category not found",
      });
    }
    await _productCategory.findByIdAndDelete(id);
    res.status(200).json({
      success: "Delete category success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
