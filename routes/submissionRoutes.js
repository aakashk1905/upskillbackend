const express = require("express");
const { submitTask, getSubmissionsBymail, feedback } = require("../controllers/submissions");

const router = express.Router();

router.route("/task/submit").post(submitTask);
router.route("/mentor/feedback").post(feedback);
router.route("/submissions/get").get(getSubmissionsBymail);


module.exports = router;
