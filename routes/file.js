const express = require("express");
const router = express.Router();
const { fileController } = require("../controllers");
const validate = require("../validators/validate");
const {} = require("../validators/file");
const isAuth = require("../middleware/isAuth");
const upload = require("../middleware/upload");



router.post("/upload", isAuth, upload.array("image",3), fileController.uploadFile);

module.exports = router;
