const express = require("express");
const {
  registerUser,
  loginUser,
  forgot,
  reset,
  joined,
  closed,
  getUser,
  updateStreak,
  gettaskbymail,
  getAll,
  updatetaskbymail,
  regtop,
  getLeaderboard,
  lastlogin,
} = require("../controllers/user");
const router = express.Router();

router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/lastlogin").put(lastlogin);
router.route("/user/forgot").post(forgot);
router.route("/user/regotp").post(regtop);
router.route("/user/reset").post(reset);
router.route("/user/getuser").get(getUser);
router.route("/user/all").get(getAll);
router.route("/user/joined").post(joined);
router.route("/user/closed").post(closed);
router.route("/user/update-streak").post(updateStreak);
router.route("/user/gettaskbymail").get(gettaskbymail);
router.route("/user/leaderboard").get(getLeaderboard);
router.route("/user/updatetaskbymail").post(updatetaskbymail);

module.exports = router;
