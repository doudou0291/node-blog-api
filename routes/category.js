const express= require('express');
const router = express.Router();
const {categoryController} = require("../controllers")
const validate =require("../validators/validate")
const {addCategoryValidator,idValidator} = require("../validators/category")
const isAuth = require("../middleware/isAuth")
const isAdmin = require("../middleware/isAdmin")

router.post("/",isAuth,isAdmin,addCategoryValidator,validate, categoryController.addCategory);

router.put("/:id",isAuth,isAdmin,idValidator,validate,categoryController.updateCategory)

router.delete("/:id",isAuth,isAdmin,idValidator,validate,categoryController.deleteCategory)

router.get("/",isAuth,isAdmin,categoryController.getCategories)

router.get("/:id",isAuth,isAdmin,categoryController.getCategory)








module.exports = router;