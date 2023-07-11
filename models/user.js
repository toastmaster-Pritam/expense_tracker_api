import mongoose from "mongoose";
import validator from "validator";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose"
import { hashSync } from "bcrypt";
import crypto from "crypto"

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "username cannot exceed 30 characters"],
    minLength: [3, "username should have more than 3 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
    validate: {
      validator: function (password) {
        const passwordRegex =
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
        return passwordRegex.test(password);
      },
      message:
        "Password should be strong (at least one uppercase letter, one lowercase letter, one digit, and one special character).",
    },
  },
  resetPasswordToken: String,
  tokenExpiry: Date,
});

userSchema.plugin(passportLocalMongoose)

//generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  //generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  this.tokenExpiry= Date.now() + 10 * 60 * 1000

  return resetToken;
};

userSchema.pre("save",async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = hashSync(this.password, 10);
})

export const User = mongoose.model("User", userSchema);
