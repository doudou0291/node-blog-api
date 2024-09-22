const { check } = require("express-validator");
const validateEmail=require("./validateEmail")

const signupValidator = [
  check("name").notEmpty().withMessage("name is required"),
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 char long")
    .notEmpty()
    .withMessage("password is required"),
];

const signinValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
];

const verifyUserValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("code").isEmpty().withMessage("code is required"),
];

const recoverPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("code")
  .notEmpty()
  .withMessage("code is required"),
  check("newPassword")
  .isLength({ min: 6 })
  .withMessage("password should be at least 6 char long")
  .notEmpty()
  .withMessage("password is required"),
];

const changePasswordValidator=[
  check("oldPassword")
  .notEmpty()
  .withMessage("old password is required"),
  check("newPassword")
  .notEmpty()
  .withMessage("new password is required"),
]

const updateProfileValidator=[
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
]
// const updateProfileValidator = [
//   check("email").custom(email=>{
//     const isValidEmail=validateEmail(email);
//     if(!isValidEmail){
//       throw new Error("Invalid email")
//     }
//   })
// ];



module.exports = {
  signupValidator,
  signinValidator,
  emailValidator,
  verifyUserValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
};
