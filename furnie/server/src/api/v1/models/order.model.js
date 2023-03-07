import mongoose from "mongoose";
import { format } from "date-fns";
const orderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    cart: { type: Array, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: Array,
      default: [
        { k: "Waiting", v: true },
        { k: "Shipping", v: false },
        { k: "Cancel", v: false },
        { k: "Success", v: false },
      ],
    },
    user: { type: String, ref: "user" },
    paymentMethod: { type: Number, default: 1 },
    createDate: { type: String, default: format(new Date(), "dd/MM/yyyy") },
  },
  { timestamps: true }
);
const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
