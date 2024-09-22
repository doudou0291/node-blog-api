const { User } = require("../models");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.code = 400;
      throw new Error("email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({
      code: 201,
      status: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid email");
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.code = 401;
      throw new Error("Invalid password");
    }

    const token = generateToken(user);

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "user signin successfully",
        data: { token },
      });
  } catch (err) {
    next(err);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("User not found");
    }
    if (user.isVerified) {
      res.code = 400;
      throw new Error("User already verified");
    }

    const code = generateCode(6);

    user.verificationCode = code;
    await user.save();

    await sendEmail({
      emailTo: user.email,
      subject: "Verification code",
      code,
      content: "Verify your account",
    });

    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "user verification code sent successfully",
      });
  } catch (err) {
    next(err);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (user.verificationCode !== code) {
      res.code = 400;
      throw new Error("Invalid verification code");
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res
      .status(200)
      .json({ code: 200, status: true, message: "user verified successfully" });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    const code = generateCode(6);
    user.forgotPasswordCode = code;
    await user.save();
    await sendEmail({
      emailTo: user.email,
      subject: "Forgot Password Code",
      code,
      content: "Reset your password",
    });
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "forgot password code sent successfully",
      });
  } catch (err) {
    next(err);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (user.forgotPasswordCode !== code) {
      res.code = 400;
      throw new Error("Invalid code");
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    await user.save();
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "password recovered successfully",
      });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const {oldPassword, newPassword } = req.body;
    const {_id}= req.user
    const user = await User.findById( _id );
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      res.code = 400;
      throw new Error("Invalid password");
    }
    if(oldPassword===newPassword){
        res.code = 400;
        throw new Error("New password should be different from old password");
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({
        code: 200,
        status: true,
        message: "password recovered successfully",
      });
  } catch (err) {
    next(err);
  }
};


const updateProfile = async (req, res, next) => {
    try{
        const {name,email}=req.body;
        const {_id} = req.user;
        const user = await User.findById(_id).select("-password -verificationCode -forgotPasswordCode");
        if(!user){
            res.code=404;
            throw new Error("User not found");
        }
        if(email){
            const isUserExist = await User.findOne({email});
            if(isUserExist && isUserExist.email === email && String(user._id)=== String(isUserExist._id)){
                res.code=400;
                throw new Error("Email already exists");
            }
        }

        user.name= name ? name : user.name;
        user.email= email ? email : user.email;
        if(email){
            user.isVerified= false
        }
        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "User profile updated successfully",
            data: {user}
        });
    }catch(err){
        next(err)
    }
}

const currentUser= async (req, res, next) =>{
  try{
    const _id = req.user;
    const user = await User.findById(_id).select("-password -verificationCode -forgotPasswordCode");
    if(!user){
      res.code=404;
      throw new Error("User not found");
    }
    res.status(200).json({code:200,status:true,message:"got current user successfully",data:{user}})
  }catch(err){
    next(err)
  }
}

module.exports = {
  signup,
  signin,
  verifyCode,
  verifyUser,
  forgotPasswordCode,
  recoverPassword,
  changePassword,
  updateProfile,
  currentUser,
};
