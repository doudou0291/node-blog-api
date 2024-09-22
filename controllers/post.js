const { Post, Category } = require("../models");

const addPost = async (req, res, next) => {
  try {
    // const {title,desc,file,category}=req.body;
    const { title, desc, category } = req.body;
    const _id = req.user._id;
    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      res.code = 404;
      throw new Error("category not found");
    }
    // const newPost = new Post({title,desc,file,category,updatedBy:_id});
    const newPost = new Post({ title, desc, category, updatedBy: _id });
    await newPost.save();
    res
      .status(201)
      .json({
        code: 201,
        status: true,
        message: "post added successfully",
        data: newPost,
      });
  } catch (err) {
    next(err);
  }
};
const updatePost = async (req, res, next) => {
  try {
    // const {title,desc,file,category}=req.body;
    const { title, desc, category } = req.body;
    const { _id } = req.user;
    const { id } = req.params;

    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      res.code = 404;
      throw new Error("category not found");
    }
    const updatedPost = await Post.findById(id);
    if (!updatedPost) {
      res.code = 404;
      throw new Error("post not found");
    }
    updatedPost.title = title ? title : updatedPost.title;
    updatedPost.desc = desc ? desc : updatedPost.desc;
    updatedPost.category = category ? category : updatedPost.category;
    updatedPost.updatedBy = _id;
    await updatedPost.save();
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "post updated successfully",
        data: updatedPost,
      });
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("post not found");
    }
    await post.findByIdAndDelete(id);
    res
      .status(200)
      .json({ code: 200, status: true, message: "post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page, size, q } = req.query;
    const pageNumber = parseInt(page) || 1;
    const sizeNumber = parseInt(size) || 10;
    let query = {};
    if (q) {
      const search = new RegExp(q, "i");
      query = {
        $or: [{ title: search }],
      };
    }

    if (category) {
      query = { ...query, category };
    }

    const total = await Post.countDocuments(query);
    const pages = Math.ceil(total / pageNumber);
    const posts = await Post.find(query)
      .sort({ updatedBy: -1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "post deleted successfully",
        data: { posts, total, pages },
      });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate(
      "category",
      "-password -verificationCode -forgotPasswordCode"
    );
    if (!post) {
      res.code = 404;
      throw new Error("post not found");
    }
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "post fetched successfully",
        data: post,
      });
  } catch (err) {
    next(err);
  }
};

module.exports = { addPost, updatePost, deletePost, getPosts, getPost };
