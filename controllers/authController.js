const { JsonWebTokenError } = require('jsonwebtoken');
const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const  jwt = require('jsonwebtoken');
const appError=require('./../utils/appError');
const AppError = require('./../utils/appError');

exports.signup=catchAsync(async(req,res,next)=>{
    const newUser=await User.create(req.body);
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
    res.status(201).json({
        status:'sucess',
        token,
        data:{
            user:newUser,
        }
    });
})
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

  console.log(user)
   
  
    // 3) If everything ok, send token to client
    // createSendToken(user, 200, res);
    const token="";
    res.status(200).json({
        status:'sucess',
        token
    })
  });
