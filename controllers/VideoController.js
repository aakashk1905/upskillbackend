const Video = require("../models/VideoModel");
const crypto = require("crypto-js");

exports.getVideo = async (req, res) => {
  try {
    const videos = await Video.find();

    const video = encryptData(JSON.stringify({ videos }), "UMum12@#Secret");
    res.status(200).json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addVideo = async (req, res) => {
  try {
    const { lec, link } = req.body;
    const existingVideo = await Video.findOne({ lec });

    if (existingVideo) {
      return res.status(400).json({
        success: false,
        message: "Video for this Lecture Number Already Exists",
      });
    }

    const addedVideo = await Video.create({ lec, link });
    res.status(201).json({ success: true, addedVideo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.editVideo = async (req, res) => {
  try {
    const { lec, link } = req.body;
    const existingVideo = await Video.findOne({ lec });

    if (!existingVideo) {
      return res.status(400).json({
        success: false,
        message: "Video Doesn't Exist",
      });
    }

    existingVideo.link = link;
    await existingVideo.save();
    res.status(200).json({ success: true, updatedVideo: existingVideo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

function encryptData(data, key) {
  return crypto.AES.encrypt(String(data), key).toString();
}
