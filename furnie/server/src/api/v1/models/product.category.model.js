import mongoose from "mongoose";
const productCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    url: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);
const productCategory =
  mongoose.models.productCategory ||
  mongoose.model("productCategory", productCategorySchema);
export default productCategory;
