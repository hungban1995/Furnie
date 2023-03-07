import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    console.log("Connec db success");
  } catch (err) {
    console.log(err);
  }
};
export default connectDB;
