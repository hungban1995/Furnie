import yup from "yup";

//----------Product validate----------//
const productSchema = yup.object().shape({
  title: yup.string().required("Product title is required"),
  price: yup
    .number("Price must be number")
    .min(0, "Price can not be less then 0"),
  onSale: yup
    .number("Sale off must be number")
    .min(0, "Sale off can not be less than 0"),
  inStock: yup
    .number("Stock quantity must be number")
    .min(0, "Stock quantity can not less than 0"),
  sold: yup
    .number("Stock quantity must be number")
    .min(0, "Sold quantity can not be less than 0"),
});
export const validate = async (req, res, next) => {
  try {
    console.log("Product validate: ", req.body);
    const { title, price, onSale, inStock, sold } = req.body;
    await productSchema.validate({ title, price, onSale, inStock, sold });
    next();
  } catch (err) {
    console.log(err.message);
    next({
      status: 400,
      error: err.message,
    });
  }
};

//----------Product attributes validate----------//
const productAttributeSchema = yup.object().shape({
  price: yup
    .number("Price must be number")
    .min(0, "Price can not be less then 0"),
  onSale: yup
    .number("Sale off must be number")
    .min(0, "Sale off can not be less than 0"),
  inStock: yup
    .number("Stock quantity must be number")
    .min(0, "Stock quantity can not less than 0"),
  sold: yup
    .number("Stock quantity must be number")
    .min(0, "Sold quantity can not be less than 0"),
  values: yup.array(),
});
export const productAttributeValidate = async (req, res, next) => {
  try {
    let values = [];
    if (req.body.values) {
      values = JSON.parse(req.body.values);
    }
    const { price, onSale, inStock, sold } = req.body;
    await productAttributeSchema.validate({
      price,
      onSale,
      inStock,
      sold,
      values,
    });
    next();
  } catch (err) {
    console.log(err);
    next({
      status: 400,
      error: err.message,
    });
  }
};
