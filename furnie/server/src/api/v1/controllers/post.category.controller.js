import _PostCategory from "../models/post.category.model.js";

//----------Create category----------//
export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return next({
        status: 400,
        error: "Invalid title",
      });
    }
    await _PostCategory.create(req.body);
    res.status(200).json({
      success: "Create post category success",
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
    const category = await _PostCategory.findById(id);
    if (!category) {
      return next({
        status: 404,
        error: "Category has been deleted or does not exist",
      });
    }
    await _PostCategory.findByIdAndUpdate(id, req.body);
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
    const category = await _PostCategory.findById(id);
    if (!category) {
      return next({
        status: 404,
        error: "Category not found",
      });
    }
    await _PostCategory.findByIdAndDelete(id);
    res.status(200).json({
      sucess: "Delete category success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
