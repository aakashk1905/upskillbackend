const express = require("express");
const {
  submitTask,
  getSubmissionsBymail,
  feedback,
  unchecked,
  getPendingSubmissionsBymail,
  all,
} = require("../controllers/submissions");

const router = express.Router();

router.route("/task/submit").post(submitTask);
router.route("/mentor/feedback").post(feedback);
router.route("/submissions/get").get(getSubmissionsBymail);
router.route("/submissions/pending").get(getPendingSubmissionsBymail);
router.route("/submissions").get(unchecked);
router.route("/submissions/all").get(all);

module.exports = router;
