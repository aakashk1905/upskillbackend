const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const moment = require("moment-timezone");

//config
dotenv.config({ path: "Backend/config/config.env" });

// Main user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    mobile: {
      type: String,
      required: [true, "Please enter your Phone Number"],
      unique: true,
    },
    language: {
      type: String,
    },
    joined: {
      type: Boolean,
    },
    closed: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").format(),
    },
    userDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JSON WEB TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// PASSWORD VERIFICATION
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
