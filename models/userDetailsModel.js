const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  streakData: {
    streak: {
      type: Number,
      required: true,
      default: 0,
    },
    longestStreak: Number,
    streakDates: [
      {
        type: Date,
      },
    ],
  },
  level: {
    type: String,
    default: "Bronze III",
  },
  points: {
    type: Number,
    default: 0,
  },
  gems: {
    type: Number,
    default: 0,
  },
  lastSubmission: {
    type: Date,
  },
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;
