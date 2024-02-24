// const mongoose = require("mongoose");
// const validator = require("validator");
// const dotenv = require("dotenv");

// //config
// dotenv.config({ path: "Backend/config/config.env" });

// const submissionModel = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   tasks: [
//     {
//       type: Object,
//     },
//   ],
// });

// module.exports = mongoose.model("Submission", submissionModel);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// //config
dotenv.config({ path: "Backend/config/config.env" });

const submission = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [
    {
      taskName: String,
      taskLink: String,
      status: {
        type: String,
        enum: ["submitted", "approved", "rejected"],
        default: "submitted",
      },
      feedback: String,
      submittedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Submission = mongoose.model("Submission", submission);

module.exports = Submission;
