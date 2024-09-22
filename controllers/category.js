const { Category, User } = require("../models");

const addCategory = async (req, res, next) => {
  try {
    const { title, desc } = req.body;
    const _id = req.user._id;
    const isCategoryExist = await Category.findOne({ title });
    if (isCategoryExist) {
      res.code = 400;
      throw new Error("Category already exists");
    }
    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    const newCategory = new Category({ title, desc, updatedBy: _id });
    await newCategory.save();
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Category added successfully",
      });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const _id = req.user._id;
    const { title, desc } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      res.code = 404;
      throw new Error("Category not found");
    }
    const isCategoryExist = await Category.findOne({ title });
    if (
      isCategoryExist &&
      isCategoryExist.title === title &&
      String(isCategoryExist._id) !== String(category._id)
    ) {
      res.code = 400;
      throw new Error("Category already exists");
    }
    category.title = title ? title : category.title;
    category.desc = desc;
    category.updatedBy = _id;
    await category.save();
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Category updated successfully",
        data: { category },
      });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      res.code = 404;
      throw new Error("Category not found");
    }
    await category.findByIdAndDelete(id);
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Category deleted successfully",
      });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const { q } = req.query;
    let query = {};

    let sizeNumber = parseInt(size) || 10;
    let pageNumber = parseInt(page) || 1;

    if (q) {
      const search = RegExp(q, "i");
      query = { $or: [{ title: search }, { desc: search }] };
    }
    const total = await Category.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);
    const categories = await Category.find(query)
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "Categories fetched successfully",
        data: { categories, total, pages },
      });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const id= req.params.id;
    const category = await Category.findById(id);
    if(!category){
        res.code=404;
        throw new Error("Category not found");
    }

    res
     .status(200)
     .json({
        code: 200,
        status: true,
        message: "Category fetched successfully",
        data: { category },
      });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
};
