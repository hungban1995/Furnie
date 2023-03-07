import _Order from "../models/order.model.js";
import _Product from "../models/product.model.js";
import _Attributes from "../models/product.attribute.model.js";
import { verifyAccessToken } from "../middlewares/auth.js";
//----------Create----------//
export const create = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error && decode.error !== "Please login") {
      //lỗi xác thực người dùng
      return next(decode);
    }
    const { cart, quantity } = req.body.order;
    if (quantity === 0 || cart.length === 0) {
      //Lỗi không có sản phẩm khi order
      return next({
        status: 400,
        error: "You do not have product to orders",
      });
    }
    let simpleProduct = cart.filter((item) => !item.attribute_id); //Sản phẩm không có biến thể
    let manyVariationProduct = cart.filter((item) => item.attribute_id); //Sản phẩm có biến thể
    if (simpleProduct.length > 0) {
      //Nếu có sản phẩm đơn giản
      let x;
      for (x of simpleProduct) {
        const product = await _Product.findById(x.product_id, { inStock: 1 });
        if (!product) {
          //Nếu không tìm thấy sản phẩm
          return next({
            status: 404,
            error: `Product ${x.title}-${x.attribute} was deleted or does not exist`,
          });
        }
        if (product.inStock === 0) {
          //Nếu số lượng tồn kho bằng không
          return next({
            status: 400,
            error: `Product ${x.title}-${x.attribute} is out of stock`,
          });
        }
        if (parseInt(x.quantity) > product.inStock) {
          //Lỗi số lượng đặt hàng nhiều hơn số lượng trong kho
          return next({
            status: 400,
            error: `Product  ${x.title}-${x.attribute} is not enough quantity to order`,
          });
        }
      }
    }
    if (manyVariationProduct.length > 0) {
      //Nếu có sản phẩm nhiều biến thể
      let x;
      for (x of manyVariationProduct) {
        const attribute = await _Attributes.findById(x.attribute_id, {
          inStock: 1,
        });
        if (!attribute) {
          //Không tìm thấy biến thể
          return next({
            status: 400,
            error: `Product ${x.title}-${x.attribute} was deleted or does not exist`,
          });
        }
        if (attribute.inStock === 0) {
          //Biến thể có số lượng tồn kho bằng 0
          return next({
            status: 400,
            error: `Product ${x.title}-${x.attribute} is out of stock `,
          });
        }
        if (parseInt(x.quantity) > attribute.inStock) {
          //Nếu sô lượng đặt hàng lớn hơn số lượng tồn kho
          return next({
            status: 400,
            error: `Product ${x.title}-${x.attribute} is not enough`,
          });
        }
      }
    }
    if (decode._id) {
      //Nếu phát hiện có người dùng đăng nhập
      req.body.user = decode._id.toString();
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Update----------//
export const update = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      //Nếu có lỗi khi xác thực người dùng
      return next(decode);
    }
    const { id } = req.params;
    const order = await _Order.findById(id);
    if (!order) {
      //Nếu không tìm thấy order
      return next({
        status: 404,
        error: "Order not found",
      });
    }
    if (decode.role !== "admin" && decode._id.toString() !== order.user) {
      //Lỗi không phải admin
      return next({
        status: 403,
        error: "You do not permistion to update this order",
      });
    }
    const currentStatus = order.status.filter((item) => item.v === true);
    if (currentStatus[0].k === "Cancel" || currentStatus[0].k === "Success") {
      //Nếu status là cancel hoặc update thì không cho update nữa
      return next({
        status: 400,
        error: "Cannot update cancel order and success order",
      });
    }
    const newInfo = req.body.order;
    const { cart, quantity, status } = newInfo;
    if (newInfo._id !== order._id.toString()) {
      //Nếu phát hiện id mới đẩy lên không bằng id cũ thì báo lỗi
      return next({
        status: 400,
        error: "Order code can not change",
      });
    }
    if (cart.length === 0 || quantity === 0) {
      //Lỗi không có sản phẩm trong order
      return next({
        status: 400,
        error: "You have not product to to order",
      });
    }
    if (newInfo.quantity !== order.quantity || newInfo.total !== order.total) {
      //Nếu các thông số cố định bị thay đổi thì sẽ báo lỗi
      return next({
        status: 400,
        error: "Can not update product in order",
      });
    }
    if (currentStatus[0].k === "Shipping") {
      if (
        newInfo.firstName !== order.firstName ||
        newInfo.lastName !== order.lastName ||
        newInfo.email !== order.email ||
        newInfo.phoneNumber !== order.phoneNumber ||
        newInfo.address !== order.address ||
        parseInt(newInfo.paymentMethod) !== order.paymentMethod
      ) {
        return next({
          status: 400,
          error: "No fields can be changed while the order status is shipping",
        });
      }
    }
    const newStatus = status.filter((item) => item.v !== false);
    if (decode.role !== "admin") {
      if (newStatus[0].k === "Success" || newStatus[0].k === "Success") {
        return next({
          status: 403,
          error: `You do not permistion to updated status tp ${newStatus[0].k}`,
        });
      }
    }
    if (JSON.stringify(newInfo.cart) !== JSON.stringify(order.cart)) {
      //Giỏ hàng ban đầu khác giỏ hàng mới được update
      return next({
        status: 400,
        error: "Can not change product in order",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Delete----------//
export const deleteOrder = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to delete order",
      });
    }
    next();
  } catch (err) {
    console.log(er);
    next(err);
  }
};
//----------Get all----------//
export const getAll = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    if (decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to view all order",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Get by id----------//
export const getById = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    const { id } = req.params;
    const order = await _Order.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!order) {
      return next({
        status: 404,
        error: "Order does not exist",
      });
    }
    if (order.user) {
      if (decode.role !== "admin" && decode._id.toString() !== order.user) {
        return next({
          status: 403,
          error: "You do not permistion to view this order",
        });
      }
    } else {
      if (decode.role !== "admin") {
        return next({
          status: 403,
          error: "You do not permistion to view this order",
        });
      }
    }
    res.status(200).json({
      success: "Get order success",
      order,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//----------Get by user----------//
export const getByUser = async (req, res, next) => {
  try {
    const decode = await verifyAccessToken(req);
    if (decode.error) {
      return next(decode);
    }
    const user = req.params.id;
    if (decode._id.toString() !== user && decode.role !== "admin") {
      return next({
        status: 403,
        error: "You do not permistion to view user's order",
      });
    }
    const orders = await _Order.find(
      { user: decode._id.toString() },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (orders.length === 0) {
      return next({
        status: 404,
        error: "This user has not order",
      });
    }
    const count = await _Order.find({ user: decode._id.toString() }).count();
    res.status(200).json({
      success: "Get orders success",
      orders,
      count,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
