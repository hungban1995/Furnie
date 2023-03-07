import mongoose from "mongoose";
const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attributeTypes: { type: Array, default: [], ref: "testAttributeType" },
});
const testAttributes =
  mongoose.models.testAttributes ||
  mongoose.model("testAttributes", attributeSchema);
export default testAttributes;
