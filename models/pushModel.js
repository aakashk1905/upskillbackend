const mongoose = require("mongoose");
const validator = require("validator");
const dotenv = require("dotenv");

//config
dotenv.config({ path: "Backend/config/config.env" });

const pushSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
    default: null,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Push", pushSchema);
