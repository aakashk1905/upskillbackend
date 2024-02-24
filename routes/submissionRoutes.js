const express = require("express");
const { submitTask, getSubmissionsBymail, feedback, unchecked } = require("../controllers/submissions");

const router = express.Router();

router.route("/task/submit").post(submitTask);
router.route("/mentor/feedback").post(feedback);
router.route("/submissions/get").get(getSubmissionsBymail);
router.route("/submissions").get(unchecked);


module.exports = router;
