const express = require("express");
const {
  getVideo,
  addVideo,
  editVideo,
} = require("../controllers/VideoController");

const router = express.Router();

router.route("/videos").get(getVideo);
router.route("/video/add").post(addVideo);
router.route("/video/edit").put(editVideo);

module.exports = router;
