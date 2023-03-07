import mongoose from "mongoose";
import { format } from "date-fns";
const postCommentSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "user" },
    post: { type: String },
    content: { type: String },
    createdDate: { type: String, default: format(new Date(), "dd/MM/yyyy") },
  },
  { timestamps: true }
);
const postComment =
  mongoose.models.postComment ||
  mongoose.model("postComment", postCommentSchema);
export default postComment;
