import _TestAttribute from "./test.atrribute.model.js";

export const create = async (req, res, next) => {
  try {
    console.log("Attribute: ", req.body);
    const newAttribute = await _TestAttribute.create(req.body);
    console.log(newAttribute);
    res.status(200).json({
      success: "Call test product api success",
      attribute: {
        _id: newAttribute._id.toString(),
        name: newAttribute.name,
        attributeTypes: newAttribute.attributeTypes,
      },
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

export const deleteTestAtrribute = async (req, res, next) => {
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
