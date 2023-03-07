import mongoose from "mongoose";
const postCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    url: { type: String },
    description: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);
const PostCategory =
  mongoose.models.postCategory ||
  mongoose.model("postCategory", postCategorySchema);
export default PostCategory;
