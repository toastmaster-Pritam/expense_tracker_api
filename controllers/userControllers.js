import { User } from "../models/user.js";
import { compareSync } from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandlerClass.js";

export const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = User.findOne({ email, username });

  if (user) return next(new ErrorHandler("User already exists", 400));
  const registeredUser = new User({
    username,
    email,
    password,
  });
  await registeredUser.save();

  req.login(registeredUser, function (err) {
    if (err) return next(err);
    res.status(201).json({
      success: true,
      user: req.user,
    });
  });
});

export const loginUser = expressAsyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && compareSync(password, user?.password))
    return res.status(200).json({
      success: true,
      message: "logged in successfully!",
      user: req.user,
    });
});

export const loginFailure = (req, res, next) => {
  return next(new ErrorHandler("incorrect username or password", 401));
};

export const logoutUser = expressAsyncHandler((req, res, next) => {
  req.logout((err) => {
    return next(new ErrorHandler("something wrong happened!"));
  });
  res.status(200).json({
    success: true,
    message: "logged out!",
  });
});

export const forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found!", 401));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/user/password/reset?token=${resetToken}`;

  const message = `Your password reset Link is valid for 10 minutes only:- \n\n ${resetLink}\n\nIf you have not requested this email,then please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Expense Tracker App Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Your password recovery mail has been sent to ${user.email} successfully!`,
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    next(new ErrorHandler(error.message));
  }
});

export const verifyOtpAndResetPassword = expressAsyncHandler(
  async (req, res, next) => {
    const { token } = req.query;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return next(
        new ErrorHandler("Invalid Token or Reset Link has been expired!", 400)
      );
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      return next(new ErrorHandler("Password does not match", 400));

    user.password = password;
    user.resetPasswordToken = undefined;
    user.tokenExpiry = undefined;

    const modifiedUser = await user.save({ validateBeforeSave: false });

    req.login(modifiedUser, function (err) {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        user: req.user,
      });
    });
  }
);

export const getUserDetails = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  const newData = {
    username: req.body.username || req.user.username,
    email: req.body.email || req.user.email,
  };

  const otherUser = await User.findOne(newData);

  if (otherUser)
    return next(
      new ErrorHandler("Your username or email matches with other user", 400)
    );
  else {
    const user = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    req.login(user, function (err) {
      if (err) return next(new ErrorHandler("something went wrong!"));
      res.status(200).json({
        success: true,
        message: "profile updated successfully!",
      });
    });
   
  }
});
