const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Fist name is required"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
    },
    profile: {
      type: String,
      default: "",
    },
  },
  { timestemps: true }
);

const User = new mongoose.model("User", UserSchema);

module.exports = User;
