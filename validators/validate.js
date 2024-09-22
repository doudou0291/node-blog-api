const {validationResult}=require("express-validator")
const validate =(req,res,next)=>{
    const errors=validationResult(req);
    const mappedErrors = {}
    if(Object.keys(errors.errors).length === 0){
        next()
    }else{
        errors.errors.map((err)=>{
            mappedErrors[err.path] = err.msg;
        })
        res.status(400).json(mappedErrors)
    }
}

module.exports=validate