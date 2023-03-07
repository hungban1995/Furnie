import _TestAttributeType from "./test.attributeType.model.js";
import _TestAttribute from "./test.atrribute.model.js";

export const create = async (req, res, next) => {
  try {
    const newAttributeType = await _TestAttributeType.create(req.body);
    await newAttributeType.populate({ path: "attribute", select: "name" });
    const attribute = await _TestAttribute.findById(req.body.attribute);
    if (!attribute) {
      return next({
        status: 404,
        error: "Attribute not found",
      });
    }
    await _TestAttribute.findByIdAndUpdate(req.body.attribute, {
      attributeTypes: [
        ...[attribute.attributeType],
        newAttributeType._id.toString(),
      ],
    });
    res.status(200).json({
      success: "Call test product api success",
      attribute: newAttributeType,
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

export const deleteTestAtrributeType = async (req, res, next) => {
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
    res.status(200).json({
      success: "Call test product api success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
