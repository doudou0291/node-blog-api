const express= require('express');
const router = express.Router();
const {postController} = require("../controllers")
const isAuth = require("../middleware/isAuth")
const validate =require("../validators/validate")
const {addPostValidator,updatePostValidator,idValidator} = require("../validators/post")

router.post("/", isAuth,addPostValidator,validate,postController.addPost);

router.put("/:id", isAuth,updatePostValidator,idValidator,validate,postController.updatePost);

router.put("/:id", isAuth,idValidator,validate,postController.deletePost);

router.get("/",isAuth,postController.getPosts)

router.get("/:id",isAuth,idValidator,postController.getPost)





module.exports = router;

