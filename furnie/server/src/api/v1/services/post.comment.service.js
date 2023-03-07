import _PostComment from "../models/post.comment.model.js";
import _Post from "../models/post.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";

//----------Create---------//
export const create = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    const postId = req.query.post;

    const post = await _Post.findById(postId);

    if (!post) {
      return next({
        status: 404,
        error: "Post no found",
      });
    }

    const newComment = await _PostComment.create({
      user: decode._id,
      post: post._id,
      content: req.body.content,
    });

    const cunrrentComment = post.comment;

    const newComments = [...cunrrentComment, newComment._id.toString()];

    await _Post.findByIdAndUpdate(postId, { comment: newComments });

    await newComment.populate({ path: "user", select: "username avatar" });

    res.status(200).json({
      success: "Create new comment success",
      comment: {
        user: newComment.user,
        content: req.body.content,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update---------//
export const update = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);

    if (decode.error) {
      return next(decode);
    }

    const { id } = req.params;

    const comment = await _PostComment.findById(id);

    if (!comment) {
      return next({
        status: 404,
        error: "Comment not found",
      });
    }

    if (decode._id.toString() !== comment.user && decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permission to update post comment",
      });
    }

    await _PostComment.findByIdAndUpdate(id, {
      content: req.body.content,
    });

    res.status(200).json({
      success: "Update post comment success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------delete----------//
export const deletePostComment = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    const { id } = req.params;

    const postId = req.query.post;

    const comment = await _PostComment.findById(id);

    if (!comment) {
      return next({
        status: 404,
        error: "Comment not found",
      });
    }

    const post = await _Post.findById(postId);

    if (!post) {
      return next({
        status: 404,
        error: "Post no found",
      });
    }

    const newCommnets = post.comment.filter((item) => item !== id);

    await _Post.findByIdAndUpdate(postId, { comment: newCommnets });

    await _PostComment.findByIdAndDelete(id);

    res.status(200).json({
      success: "Delete post comment success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get by post----------//
export const getByPost = async (req, res, next) => {
  try {
    const { post } = req.query;
    console.log(post);
    if (!post) {
      return next({
        status: 404,
        error: "Post not found",
      });
    }
    const comments = await _PostComment
      .find({ post: post }, { user: 1, content: 1, post: 1, createdDate: 1 })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "user", select: "username avatar" });
    if (comments.length === 0) {
      return next({
        status: 404,
        error: "No comments found",
      });
    }
    const commentsCount = await _PostComment.find({ post: post }).count();
    res.status(200).json({
      success: "Get commnets success",
      comments,
      commentsCount,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
