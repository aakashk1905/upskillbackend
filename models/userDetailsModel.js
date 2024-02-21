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
    streakDates: [
      {
        type: Date,
      },
    ],
  },
  level: {
    type: String,
    default: "Freshi",
  },
  points: {
    type: Number,
    default: 0,
  },
  gems: {
    type: Number,
    default: 0,
  },
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;
