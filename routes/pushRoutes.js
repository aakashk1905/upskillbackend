const express = require('express');
const { saveSubscription,sendNotification} = require('../controllers/push');
const router = express.Router();

router.route('/save-subscription').post(saveSubscription);
// router.route('/user/login').post(loginUser);
router.route("/send-notification").get(sendNotification);
// router.route("/user/getuser").get(getUser);
// router.route("/user/setlanguage").post(setLang);
// router.route("/user/getActive").get(getActive);

module.exports = router;