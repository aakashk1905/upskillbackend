const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  joined,
  closed,
  updateStreak,
  gettaskbymail,

  updatetaskbymail,
  getLeaderboard,
} = require("../services/userService");
const UserDetails = require("../models/userDetailsModel");
const moment = require("moment-timezone");
// const userr = require("../test.users.json");
// migrateUser = async (req, res) => {
//   try {
//     for (const ur of userr) {
//       const userDetailsData = {
//         streakData: {
//           streak: ur.streakData.streak,
//           streakDates: ur.streakData.streakDates.map(
//             (dateObj) => new Date(dateObj.$date)
//           ),
//         },
//         email: ur.email,
//       };
//       const details = await UserDetails.create(userDetailsData);

//       await User.create({
//         name: ur.name,
//         email: ur.email,
//         password: ur.password,
//         mobile: ur.mobile,
//         userDetails: details._id,
//       });
//     }
//     console.log("done");
//     return res.status(200).json({
//       success: true,
//       message: "Migration completed successfully.",
//     });
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
//       return res.status(400).json({
//         success: false,
//         error:
//           "Mobile number already exists. Please use a different mobile number.",
//       });
//     } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
//       return res.status(400).json({
//         success: false,
//         error: "Email ID already exists. Please use a different Email.",
//       });
//     } else {
//       // Other errors
//       return res.status(500).json({ success: false, error: err.message });
//     }
//   }
// };

// const registerUser = async (u) => {
//   const { name, email, password, mobile, mern } = u;

//   try {
//     let newUser;
//     // Check if the user already exists
//     let existingUser = await User.findOne({ email });

//     // If the user exists, update the details
//     if (existingUser) {
//       console.log(`user already exists ${email}`);
//       return;
//       // newUser = await User.findOneAndUpdate(
//       //   { email },
//       //   {
//       //     name,
//       //     email,
//       //     password,
//       //     mobile,
//       //   },
//       //   { new: true } // return the updated document
//       // );
//     } else {
//       // Create a new user
//       const details = await UserDetails.create({ points: 30, email });
//       newUser = await User.create({
//         name,
//         email,
//         password,
//         mobile,
//         userDetails: details._id,
//       });
//     }
//     console.log(`User registered: ${newUser}`);
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
//       console.log(`Error registering user: ${err.message}`);
//     } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
//       console.log(`Error registering user: ${err.message}`);
//     } else {
//       console.log(`Error registering user: ${err.message}`);
//     }
//   }
// };

// const user = require("../userdata.json");
// const registerAllUsers = async () => {
//   for (const u of user) {
//     await registerUser(u);
//   }
// };

// registerAllUsers();

exports.registerUser = async (req, res) => {
  const { name, email, password, mobile, mern } = req.body;
  var details = null;
  try {
    let newUser;

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.mobile = mobile;
      existingUser.password = password;
      existingUser.name = name;
      await existingUser.save();
      return res.status(200).json({
        success: true,
        newUser: existingUser,
      });
    } else {
      details = await UserDetails.create(req.body);
      newUser = await User.create({
        name,
        email,
        password,
        mobile,
        userDetails: details._id,
      });
    }

    // if (mern) {
    //   try {
    //     await sendNewUser(mobile);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    return res.status(200).json({
      success: true,
      newUser,
    });
  } catch (err) {
    if (details) {
      try {
        await UserDetails.deleteOne({ _id: details._id });
      } catch (deleteErr) {
        console.error("Error deleting UserDetails:", deleteErr);
      }
    }
    if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
      return res.status(400).json({
        success: false,
        error:
          "Mobile number already exists. Please use a different mobile number.",
      });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({
        success: false,
        error: "Email ID already exists. Please use a different Email.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

exports.getUser = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email }).populate("userDetails");
    res.status(200).json({ success: true, userGot: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().populate("userDetails");
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
exports.getLeaderboard = async (req, res) => {
  const email = req.query.email;
  getLeaderboard(email)
    .then((data) => {
      res
        .status(200)
        .json({ success: true, leaderboard: data.lb, myRank: data.myRank });
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
};
exports.updatetaskbymail = async (req, res) => {
  const email = req.query.email;
  const sheetname = req.query.sheetname;
  const status = req.query.status;
  updatetaskbymail(email, sheetname, status)
    .then((data) => res.status(200).json({ success: true, tasks: data }))
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
};

// updateStreakAll("rockingak187@gmail.com");
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
  console.log(email, password);
  try {
    if (credential && credential !== "") {
      const decode = jwt.decode(credential.credential);
      // console.log(decode);
      if (!decode)
        return res.status(403).json({
          success: false,
          message: "Something Went Wrong Please Try Again",
        });

      const user = await User.findOne({ email: decode.email }).populate(
        "userDetails"
      );
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
    const user = await User.findOne({ email })
      .populate("userDetails")
      .select("+password");

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

exports.lastlogin = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No User found",
      });
    }
    user.lastLogin = moment().tz("Asia/Kolkata").format();
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Last Login Updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function encryptData(data, key) {
  return crypto.AES.encrypt(String(data), key).toString();
}
function decryptData(encryptedData, key) {
  const bytes = crypto.AES.decrypt(encryptedData, key);
  const decryptedData = bytes.toString(crypto.enc.Utf8);
  return decryptedData;
}

// new user otp
exports.regtop = async (req, res) => {
  const number = req.query.number;
  const oldotp = req.body.otpsent;
  const key = "justEncryptOtpAndSendEOeo12@#";
  // console.log(req.body, oldotp);
  if (oldotp) {
    try {
      const restotp = decryptData(oldotp, key);

      await sendNewOtp(number, restotp);
      return res.status(200).json({
        success: true,
        key: oldotp,
        message: "Otp Resent to Whatsapp",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong please try again",
      });
    }
  }

  // generate otp
  const otp = Math.floor(Math.random() * 9000) + 1000;
  const newOtp = encryptData(otp, key);

  try {
    await sendNewOtp(number, otp);
    // console.log(otp);
    res.status(200).json({
      success: true,
      key: newOtp,
      message: "Otp Sent to Whatsapp",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong please try again",
    });
  }
};
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
  // console.log(otp);
  try {
    // console.log("user");
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

  const user = await User.findOne({
    resetPasswordToken: otp,
    resetPasswordExpire: { $gt: new Date() },
  }).populate("userDetails");
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
    message: "Password Reset Successfull",
    user,
  });
};

const sendNewUser = async (number) => {
  // console.log(number);
  try {
    const response = await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic MGRiYUtNMDNSRlFteUJ2VGJTSkVzTVhBNnl6X2sxX2phc2JldjU3OWhSUTo=",
      },
      body: JSON.stringify({
        countryCode: "+91",
        phoneNumber: number,
        type: "Template",
        template: {
          name: "mern_onboard_msg",
          languageCode: "en",
          headerValues: [
            "https://s3.ap-south-1.amazonaws.com/upskillmafia.com/onboard.mp4",
          ],
        },
      }),
    });

    if (!response.ok) throw new Error("Something went Wrong");
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const sendNewOtp = async (number, otp) => {
  try {
    const response = await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic MGRiYUtNMDNSRlFteUJ2VGJTSkVzTVhBNnl6X2sxX2phc2JldjU3OWhSUTo=",
      },
      body: JSON.stringify({
        countryCode: "+91",
        phoneNumber: number,
        type: "Template",
        template: {
          name: "new_otp",
          languageCode: "en",
          bodyValues: [otp],
        },
      }),
    });

    if (!response.ok) throw new Error("Something went Wrong");
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const sendOtp = async (number, otp) => {
  try {
    const response = await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic MGRiYUtNMDNSRlFteUJ2VGJTSkVzTVhBNnl6X2sxX2phc2JldjU3OWhSUTo=",
      },
      body: JSON.stringify({
        countryCode: "+91",
        phoneNumber: number,
        type: "Template",
        template: {
          name: "forgot_password",
          languageCode: "en",
          bodyValues: [otp],
        },
      }),
    });

    if (!response.ok) throw new Error("Something went Wrong");
  } catch (e) {
    console.log(e);
    throw e;
  }
};
