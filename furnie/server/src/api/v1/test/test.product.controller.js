import _TestProduct from "./test.product.model.js";
import _TestAttribute from "./test.atrribute.model.js";

export const create = async (req, res, next) => {
  try {
    const { title, url, description, haveAttributes, attributes } = req.body;
    if (!haveAttributes) {
      await _TestProduct.create({
        title,
        url,
        description,
        haveAttributes,
        attributes,
      });
      return res.status(200).json({
        success: "Create product success",
      });
    }
    const newProduct = await _TestProduct.create({
      title,
      url,
      description,
      haveAttributes,
    });
    attributes.forEach((item) => {
      item.product = newProduct._id;
    });
    const newAttributeCreated = await _TestAttribute.insertMany(attributes);
    const newAttributes = [];
    newAttributeCreated.forEach((item) => {
      newAttributes.push(item._id.toString());
    });
    await _TestProduct.findByIdAndUpdate(newProduct._id.toString(), {
      attributes: newAttributes,
    });
    res.status(200).json({
      success: "Create product success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    res.status(200).json({
      success: "Call test product api success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteTestProduct = async (req, res, next) => {
  try {
    res.status(200).json({
      success: "Call test product api success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await _TestProduct
      .find({ haveAttributes: true })
      .populate({ path: "attributes" });
    res.status(200).json({
      success: "Call test product api success",
      data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
