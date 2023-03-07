import _Order from "../models/order.model.js";
import _Product from "../models/product.model.js";
import _Attributes from "../models/product.attribute.model.js";
//----------Create----------//
export const create = async (req, res, next) => {
  try {
    const { order, user } = req.body;
    order.user = user;
    const newOrder = await _Order.create(order);
    let simpleProduct = newOrder.cart.filter((item) => !item.attribute_id);
    let manyVariationProduct = newOrder.cart.filter(
      (item) => item.attribute_id
    );
    if (simpleProduct.length > 0) {
      //Update số lượng sản phẩm đơn giản khi đặt hàng thành công
      let x;
      for (x of simpleProduct) {
        const product = await _Product.findById(x.product_id);
        const newInStock = product.inStock - parseInt(x.quantity);
        await _Product.findByIdAndUpdate(x.product_id, { inStock: newInStock });
      }
    }
    if (manyVariationProduct.length > 0) {
      //Update số lượng sản phẩm có nhiều biến thể khi đặt hàng thành công
      let x;
      for (x of manyVariationProduct) {
        const attribute = await _Attributes.findById(x.attribute_id);
        const newInStock = attribute.inStock - parseInt(x.quantity);
        await _Attributes.findByIdAndUpdate(x.attribute_id, {
          inStock: newInStock,
        });
      }
    }
    res.status(200).json({
      success: "Order success",
      order: {
        firstName: newOrder.firstName,
        lastName: newOrder.lastName,
        address: newOrder.address,
        phoneNumber: newOrder.phoneNumber,
        email: newOrder.email,
        cart: newOrder.cart,
        createDate: newOrder.createDate,
        quantity: newOrder.quantity,
        total: newOrder.total,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Update----------//
export const update = async (req, res, next) => {
  try {
    const { cart } = req.body.order;
    const { status } = req.body.order;
    const newStatus = status.filter((item) => item.v === true);
    const simpleProduct = cart.filter((item) => !item.attribute_id);
    const manyVariationProduct = cart.filter((item) => item.attribute_id);
    if (simpleProduct.length > 0) {
      //Update số lượng sản phẩm đơn giản khi cập nhật đơn hàng thành công
      let x;
      let newInStock;
      let newSold;
      for (x of simpleProduct) {
        const product = await _Product.findById(x.product_id);
        if (!product) {
          return next({
            status: 404,
            error: `Product ${x.title}-${x.attribute} not found`,
          });
        }
        if (newStatus[0].k === "Cancel") {
          //Update số lượng khi newStatus là cancel
          newInStock = parseInt(x.quantity) + product.inStock;
          await _Product.findByIdAndUpdate(x.product_id, {
            inStock: newInStock,
          });
        }
        if (newStatus[0].k === "Success") {
          //Update số lượng khi newStatus là Success
          newSold = parseInt(x.quantity) + product.sold;
          await _Product.findByIdAndUpdate(x.product_id, { sold: newSold });
        }
      }
    }
    if (manyVariationProduct.length > 0) {
      //Update số lượng sản phẩm nhiều biến thể khi upodate đơn hàng thành công
      let x;
      let newInStock;
      let newSold;
      for (x of manyVariationProduct) {
        const attribute = await _Attributes.findById(x.attribute_id);
        if (!attribute) {
          return next({
            status: 404,
            error: `Product ${x.title}-${x.attribute} not found`,
          });
        }
        if (newStatus[0].k === "Cancel") {
          //update số lượng khi new status là cancael
          newInStock = parseInt(x.quantity) + attribute.inStock;
          await _Attributes.findByIdAndUpdate(x.attribute_id, {
            inStock: newInStock,
          });
        }
        if (newStatus[0].k === "Success") {
          //update số lượng khi new status là success
          newSold = parseInt(x.quantity) + attribute.sold;
          await _Attributes.findByIdAndUpdate(x.attribute_id, {
            sold: newSold,
          });
        }
      }
    }
    await _Order.findByIdAndUpdate(req.params.id, req.body.order);
    res.status(200).json({
      success: "Update order success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await _Order.findById(id);
    if (!order) {
      return next({
        status: 404,
        error: "Order no found",
      });
    }
    const currentStatus = order.status.filter((item) => item.v !== false);
    if (currentStatus[0].k === "Shipping") {
      return next({
        status: 400,
        error: "Can not delete order when status is shipping",
      });
    }
    if (currentStatus[0].k === "Waiting") {
      const simpleProduct = order.cart.filter((item) => !item.attribute_id);
      const manyVariationProduct = order.cart.filter(
        (item) => item.attribute_id
      );
      if (simpleProduct.length > 0) {
        let x;
        for (x of simpleProduct) {
          const product = await _Product.findById(x.product_id);
          if (!product) {
            return next({
              status: 404,
              error: `Product ${x.title}-${x.attribute} not found`,
            });
          }
          const newInStock = x.quantity + product.inStock;
          await _Product.findByIdAndUpdate(x.product_id, {
            inStock: newInStock,
          });
        }
      }
      if (manyVariationProduct.length > 0) {
        let x;
        for (x of manyVariationProduct) {
          const attribute = await _Attributes.findById(x.attribute_id);
          if (!attribute) {
            return next({
              status: 404,
              error: `Product ${x.title}-${x.attribute} not found`,
            });
          }
          const newInStock = x.quantity + attribute.inStock;
          await _Attributes.findByIdAndUpdate(x.attribute_id, {
            inStock: newInStock,
          });
        }
      }
      await _Order.findByIdAndDelete(id);
      return res.status(200).json({
        success: "Delete order success",
      });
    }
    await _Order.findByIdAndDelete(id);
    res.status(200).json({
      success: "Delete order success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Get all----------//
export const getAll = async (req, res, next) => {
  try {
    const { page, pageSize, status, payment, sort } = req.query;
    const skipItem = (parseInt(page) - 1) * parseInt(pageSize);
    const count = await _Order
      .count()
      .skip(skipItem || 0)
      .limit(pageSize || 15)
      .sort({ createdAt: sort || 0 });
    let orders = [];
    if (!status && !payment) {
      orders = await _Order
        .find(
          {},
          {
            __v: 0,
          }
        )
        .skip(skipItem || 0)
        .limit(pageSize || 0)
        .sort({ createdAt: sort || -1 });
    }
    if (status) {
      orders = await _Order
        .find(
          {
            status: { $in: [{ k: status, v: true }] },
          },
          {
            __v: 0,
          }
        )
        .skip(skipItem || 0)
        .limit(pageSize || 0)
        .sort({ createdAt: sort || 0 });
    }
    if (payment) {
      orders = await _Order
        .find({
          paymentMethod: Number(payment),
        })
        .skip(skipItem || 0)
        .limit(pageSize || 0)
        .sort({ createdAt: sort || 0 });
    }
    if (payment && status) {
      orders = await _Order
        .find({
          $and: [
            { status: { $in: [{ k: status, v: true }] } },
            { paymentMethod: Number(payment) },
          ],
        })
        .skip(skipItem || 0)
        .limit(pageSize || 0)
        .sort({ createdAt: sort || 0 });
    }
    if (orders.length === 0) {
      return next({
        status: 404,
        error: "No order found",
      });
    }

    res.status(200).json({
      success: "Get orders success",
      orders,
      count,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
