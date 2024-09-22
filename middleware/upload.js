const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode")

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        callback(null,Date.now()+file.originalname);
        const extension = path.extname(file.originalname);
        const filename = file.originalname.replace(extension,"").split(" ").join("_").toLocaleLowerCase();
        const code = generateCode(12);
        const finalFile = `${filename}_${code}${extension}`
        callback(null,finalFile);
    }
})
const upload = multer({
    storage,
    fileFilter:(req,file,callback)=>{
        const mimetype = file.mimetype;
        if(mimetype === "image/jpg" || mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "application/pdf"){
            callback(null,true);
        }else{
            callback(new Error("Invalid file type. Only .jpg,.jpeg,.png and .pdf are allowed."));
        }
    }
});
module.exports = upload;

