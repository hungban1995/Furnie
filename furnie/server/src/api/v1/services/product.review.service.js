import _Product from "../models/product.model.js";
import _ProductReview from "../models/product.review.model.js";
import _Users from "../models/user.model.js";
import _Order from "../models/order.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";
//----------Create----------//
export const create = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    const productId = req.query.product;
    if (!productId) {
      return next({
        status: 400,
        error: "Canot create product review",
      });
    }
    const { comment, rating } = req.body.review;
    const product = await _Product.findById(productId);
    if (!product) {
      return next({
        status: 404,
        error: "Product not found",
      });
    }
    const order = await _Order.findOne({
      user: decode._id.toString(),
      $and: [
        { status: { $elemMatch: { k: "Success", v: true } } },
        { cart: { $elemMatch: { product_id: product._id.toString() } } },
      ],
    });
    console.log(order);
    if (!order) {
      return next({
        status: 403,
        error:
          "You can not create review because you do not buy this product or your order is not success yet",
      });
    }
    //Tạo product review mới
    const newProductReview = await _ProductReview.create({
      user: decode._id,
      product: productId,
      comment,
      rating,
    });
    //Tạo new rating count
    const newRatingCount = Number(product.ratingCount) + 1;
    //Tạo new total rating
    const newTotalRating =
      Number(product.totalRating) + Number(newProductReview.rating);
    //Push review vừa tạo vào product
    product.review.push(newProductReview._id.toString());
    //Tạo đánh giá trung bình mới
    const newAverageRating = (
      Number(newTotalRating) / Number(newRatingCount)
    ).toFixed(1);
    //Tiến hành update đánh giá của sản phẩm
    await _Product.findByIdAndUpdate(productId, {
      ratingCount: Number(newRatingCount),
      totalRating: Number(newTotalRating),
      averageRating: Number(newAverageRating),
      review: product.review,
    });
    //Lấy thông tin user trong product review mói tạo
    await newProductReview.populate({
      path: "user",
      select: "username avatar",
    });
    //Trả dữ liệu về cho người dùng khi thành công
    res.status(200).json({
      success: "Create product review success",
      newProductReview: {
        user: newProductReview.user,
        comment: newProductReview.comment,
        rating: newProductReview.rating,
        date: newProductReview.createdDate,
      },
    });
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
    const { id } = req.params;
    //Lấy product review bằng id
    const productReview = await _ProductReview.findById(id);
    if (!productReview) {
      return next({
        status: 404,
        error: "Product review not found",
      });
    }
    //Kiểm tra quyền user trước khi sửa product review
    if (
      productReview.user !== decode._id.toString() &&
      decode.role !== "admin"
    ) {
      return next({
        status: 403,
        error: "You do not permistion to update product review",
      });
    }
    const currentRating = productReview.rating;
    //Lấy comment và đánh giá mới
    const { comment, rating } = req.body;
    //Kiểm tra xem đánh giá cũ và đánh giá mới lấy có bằng nhau không
    if (Number(rating) !== Number(currentRating)) {
      //Nếu không bằng nhau thì làm các việc sau
      //Update đánh giá mới và comment mới
      const productReviewUpdated = await _ProductReview.findByIdAndUpdate(id, {
        comment,
        rating,
      });
      //Lấy product bằng product id có trong product review
      const product = await _Product.findById(productReview.product);
      //Tạo total rating mới
      const newTotalRating =
        Number(product.totalRating) - Number(currentRating) + Number(rating);
      //Tạo đánh giá trung bình mới
      const newAverageRating = (
        Number(newTotalRating) / Number(product.ratingCount)
      ).toFixed(1);
      //Update đánh giá mới
      await _Product.findByIdAndUpdate(productReview.product, {
        totalRating: Number(newTotalRating),
        averageRating: Number(newAverageRating),
      });
      //Trả về dữ liệu cho người dùng khi thành công
      return res.status(200).json({
        success: "Update product review success",
        "New product review": {
          comment: productReviewUpdated.comment,
          rating: productReviewUpdated.rating,
        },
      });
    }
    //Nếu đánh giá cũ và mới bằng nhau thì tiến hành cập nhật comment
    const productReviewUpdated = await _ProductReview.findByIdAndUpdate(id, {
      comment,
    });
    //Trả về dữ liệu cho người dùng sau khi cập nhật thành công
    res.status(200).json({
      success: "Update product review success",
      "New product review": {
        user: productReviewUpdated.user,
        comment: productReviewUpdated.comment,
        rating: productReviewUpdated.rating,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deleteProductReview = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    const { id } = req.params;
    const productReview = await _ProductReview.findById(id);
    if (!productReview) {
      return next({
        status: 404,
        error: "Product review not found",
      });
    }
    const currentRating = Number(productReview.rating);
    if (
      productReview.user !== decode._id.toString() &&
      decode.role !== "admin"
    ) {
      return next({
        status: 403,
        error: "You do not permission to delete this product review",
      });
    }
    const product = await _Product.findById(productReview.product);
    const newProductRatingCount = Number(product.ratingCount) - 1;
    const newTotalRating = Number(product.totalRating) - Number(currentRating);
    const newAverageRating =
      Number(newTotalRating) / Number(newProductRatingCount);
    const newReviews = product.review.filter((item) => item !== id);
    console.log(newAverageRating);
    await _Product.findByIdAndUpdate(productReview.product, {
      ratingCount: Number(newProductRatingCount),
      totalRating: Number(newTotalRating),
      averageRating: Number(newAverageRating),
      review: newReviews,
    });
    await _ProductReview.findByIdAndDelete(id);
    res.status(200).json({
      success: "Delete product review success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get all----------//
export const getAll = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permission to view all product review",
      });
    }
    const productReviews = await _ProductReview
      .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({ path: "user", select: "username avatar" });
    if (productReviews.length === 0) {
      return next({
        status: 404,
        error: "No product review found",
      });
    }
    const count = await _ProductReview
      .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
      .count();
    res.status(200).json({
      success: "Get all product review success",
      productReviews,
      count,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get product review by id----------//
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productReview = await _ProductReview
      .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
      .populate({ path: "user", select: "username avatar" });
    if (!productReview) {
      return next({ status: 404, error: "Product review not found" });
    }
    res.status(200).json({
      success: "Get product review success",
      productReview,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get product review by product----------//
export const getByProduct = async (req, res, next) => {
  try {
    const productId = req.query.product;
    const product = await _Product.findById(productId);
    if (!product) {
      return next({
        status: 404,
        error: "Product not found",
      });
    }
    const reviews = await _ProductReview
      .find({ product: productId })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "avatar username role" });
    if (reviews.length === 0) {
      return next({
        status: 404,
        error: "Product review not found",
      });
    }
    const count = await _ProductReview.find({ product: productId }).count();

    res.status(200).json({
      success: "Get review success",
      reviews,
      count,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
