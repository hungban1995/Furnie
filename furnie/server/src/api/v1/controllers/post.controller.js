import _Post from "../models/post.model.js";

//----------Create----------//
export const create = async (req, res, next) => {
  try {
    await _Post.create(req.body);
    res.status(200).json({
      success: "Create post success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------update----------//
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await _Post.findById(id);
    if (!post) {
      return next({
        status: 404,
        error: "Post not found",
      });
    }
    await _Post.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: "Update post success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await _Post.findById(id);
    if (!post) {
      return next({
        status: 404,
        error: "Post has been deleted or does not exist",
      });
    }
    await _Post.findByIdAndDelete(id);
    res.status(200).json({
      success: "Delete post success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
