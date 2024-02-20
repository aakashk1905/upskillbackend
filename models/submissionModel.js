const mongoose = require("mongoose");
const validator = require("validator");
const dotenv = require("dotenv");

//config
dotenv.config({ path: "Backend/config/config.env" });

const submissionModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [
    {
      type: Object,
    },
  ],
});

module.exports = mongoose.model("Submission", submissionModel);
