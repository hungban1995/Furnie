import mongoose from "mongoose";
const testProductSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String },
  description: { type: String },
  haveAttributes: { type: Boolean, default: false },
  attributes: { type: Array, default: [], ref: "testAttributes" },
});
const testProduct =
  mongoose.models.testProduct ||
  mongoose.model("testProduct", testProductSchema);
export default testProduct;
