import mongoose from "mongoose";
const homePageDataSchema = new mongoose.Schema(
  {
    slideImages: {
      type: Array,
      default: [],
    },
    products: {
      type: Array,
      default: [],
      ref: "product",
    },
    title: { type: String },
    description: { type: String },
    categories: { type: Array, default: [], ref: "productCategory" },
    posts: { type: Array, default: [], ref: "post" },
  },
  { timestamps: true }
);
const homePageData =
  mongoose.models.homePageData ||
  mongoose.model("homePageData", homePageDataSchema);
export default homePageData;
