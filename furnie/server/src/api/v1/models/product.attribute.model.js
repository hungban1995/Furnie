import mongoose from "mongoose";
const productAttributeSchema = new mongoose.Schema(
  {
    sku: { type: String },
    product: { type: String, ref: "product" },
    price: { type: Number, default: 0, min: 0 },
    onSale: { type: Number, default: 0, min: 0 },
    inStock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    image: { type: String },
    values: { type: Array, default: [] },
  },
  { timestamps: true }
);
const productAttribute =
  mongoose.models.productAttribute ||
  mongoose.model("productAttribute", productAttributeSchema);
export default productAttribute;
