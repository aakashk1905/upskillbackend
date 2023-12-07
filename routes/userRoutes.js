const express = require('express');
const { registerUser, loginUser,logoutUser,setLang ,getUser,} = require('../controllers/user');
const router = express.Router();

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route("/user/logout").get(logoutUser);
router.route("/user/getuser").get(getUser);
router.route("/user/setlanguage").post(setLang);
// router.route("/user/getActive").get(getActive);

module.exports = router;