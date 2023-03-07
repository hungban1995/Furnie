import mongoose from "mongoose";
import yup from "yup";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: async function (email) {
          const emailSchema = yup.object().shape({
            email: yup.string().email(),
          });
          return await emailSchema.validate({ email: email });
        },
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: { type: String, default: "user" },
    root: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
