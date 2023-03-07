import mongoose from "mongoose";
const attributeTypeSchema = new mongoose.Schema({
  name: { type: String },
  attribute: { type: String, ref: "testAttributes" },
});
const testAttributeType =
  mongoose.models.testAttributeType ||
  mongoose.model("testAttributeType", attributeTypeSchema);
export default testAttributeType;
