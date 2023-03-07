import _HomePageData from "../models/homePage.data.model.js";
export const create = async (req, res, next) => {
  try {
    await _HomePageData.create(req.body);
    res.status(200).json({
      success: "Create page success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    await _HomePageData.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: "Update page success",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
