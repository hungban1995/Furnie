import mongoose from "mongoose";
import { format } from "date-fns";
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String },
    description: { type: String },
    images: { type: Array, default: [] },
    category: { type: Array, default: [], ref: "postCategory" },
    content: { type: String },
    author: { type: String, ref: "user" },
    comment: { type: Array, default: [], ref: "user" },
    createDate: { type: String, default: format(new Date(), "dd/MM/yyy") },
  },
  { timestamps: true }
);
const Post = mongoose.models.post || mongoose.model("post", postSchema);
export default Post;
