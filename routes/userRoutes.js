const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  setLang,
  getUser,
  updateStreak,
  getAll
} = require("../controllers/user");
const router = express.Router();

router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").get(logoutUser);
router.route("/user/getuser").get(getUser);
router.route("/user/all").get(getAll);
router.route("/user/setlanguage").post(setLang);
router.route("/user/update-streak").post(updateStreak);
// router.route("/user/getActive").get(getActive);

module.exports = router;
