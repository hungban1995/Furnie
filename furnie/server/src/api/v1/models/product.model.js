import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, min: 0, default: 0 },
    onSale: { type: Number, min: 0, default: 0 },
    sku: { type: String, default: "" },
    inStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    simpleProduct: { type: Boolean, default: true },
    url: { type: String },
    description: { type: String },
    images: { type: Array, default: [] },
    category: { type: Array, ref: "productCategory", default: [] },
    content: { type: String },
    review: { type: Array, default: [], ref: "productReview" },
    ratingCount: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    simpleAttributes: { type: Array, default: [] },
    attributes: { type: Array, default: [], ref: "productAttribute" },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);
export default Product;
