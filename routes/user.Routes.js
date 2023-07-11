import express from "express";
import {
  forgetPassword,
  getUserDetails,
  loginFailure,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  verifyOtpAndResetPassword,
} from "../controllers/userControllers.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import passport from "passport";
const userRouter = express.Router();

userRouter.route("/register").post(registerUser);

userRouter.route("/login-failure").get(loginFailure);
userRouter.route("/login").post(
  passport.authenticate("local", {
    failureRedirect: "/user/login-failure",
  }),
  loginUser
);

userRouter.route("/logout").get(logoutUser)
userRouter.route("/secret").get(isLoggedIn,(req,res)=>{
  res.status(200).json({
    success:true,
    message:"secret page"
  })
})

userRouter.route("/password/forget").post(forgetPassword)
userRouter.route("/password/reset").put(verifyOtpAndResetPassword)

userRouter.route("/profile").get(isLoggedIn,getUserDetails)
userRouter.route("/profile/update").put(isLoggedIn,updateProfile)

export default userRouter;
