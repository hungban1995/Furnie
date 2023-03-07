import _ProductAttribute from "../models/product.attribute.model.js";

//----------Create----------//
export const create = async (req, res, next) => {
  try {
    const attributeCreated = await _ProductAttribute.create(req.body);
    res.status(200).json({
      success: "Create attribute success",
      attribute: {
        _id: attributeCreated._id.toString(),
        values: attributeCreated.values,
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
    const { id } = req.params;
    const attribute = await _ProductAttribute.findById(id);
    if (!attribute) {
      return next({
        status: 404,
        error: "Attribute not found",
      });
    }
    await _ProductAttribute.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: "Update attribute success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//----------Delete----------//
export const deleteProductAttribute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attribute = await _ProductAttribute.findById(id);
    if (!attribute) {
      return next({
        status: 404,
        error: "Attribute not found",
      });
    }
    await _ProductAttribute.findByIdAndDelete(id);
    res.status(200).json({
      success: "Delete attribute success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
