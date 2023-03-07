import yup from "yup";

//----------Order schema----------//
const orderSchema = yup.object().shape({
  firstName: yup.string().required("Please enter your first name"),
  lastName: yup.string().required("Please enter your last name"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Please enter your email"),
  phoneNumber: yup.string().required("Please enter your phone number"),
  address: yup
    .string()
    .required("Please enter your address for convenient delivery"),
  cart: yup
    .array()
    .required("Please select a product before ordering")
    .min(1, "Please select at least 1 product before ordering"),
  quantity: yup
    .number()
    .required("Quantity can not empty")
    .min(1, "Quantity can not be less than 1"),
  total: yup
    .number()
    .required("Total can not empty")
    .min(0, "Total can not less than 0"),
  status: yup.array(),
  user: yup.string(),
  paymentMethod: yup
    .number()
    .required("Please select an payment method")
    .min(1),
});

//----------Order validate----------//
const validate = async (req, res, next) => {
  try {
    const { order } = req.body;
    await orderSchema.validate(order);
    next();
  } catch (err) {
    console.log("Order validate error:", err.message);
    next({
      status: 400,
      error: err.message,
    });
  }
};
export default validate;
