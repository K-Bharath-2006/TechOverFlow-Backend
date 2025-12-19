const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exist use another"],
      lowercase: true,
      validate: [validator.isEmail, "Please enter the correct email.."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please Enter password"],
      minlength: [8, "password must be greater than 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Enter the correct password"],
      validate: {
        validator: function (el) {
          return el == this.password;
        },
        message: "Password and confirm password are not same",
      },
    },
    contactNumber: {
      type: Number,
      required: [true, "Please Enter the Contact Number"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  //   next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const users = mongoose.model("User", userSchema);
module.exports = users;
