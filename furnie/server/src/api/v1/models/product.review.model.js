import mongoose from "mongoose";
import { format } from "date-fns";
const productReviewSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "user" },
    product: { type: String, ref: "product" },
    comment: { type: String },
    rating: { type: Number, default: 0 },
    createdDate: { type: String, default: format(new Date(), "dd/MM/yyyy") },
  },
  {
    timestamps: true,
  }
);
const productReview =
  mongoose.models.productReview ||
  mongoose.model("productReview", productReviewSchema);
export default productReview;
