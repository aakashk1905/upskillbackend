const mongoose = require("mongoose");
const dotenv = require("dotenv");

// //config
dotenv.config({ path: "Backend/config/config.env" });

const video = new mongoose.Schema({
  lec: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const Video = mongoose.model("Video", video);

module.exports = Video;
