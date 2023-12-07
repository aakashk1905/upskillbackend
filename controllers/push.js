const Push = require("../models/pushModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const webpush = require("web-push");

const apiKeys = {
  publicKey:
    "BF9h2-vsgcn3oitYD1Hwf5vGQXJNEshGCy8MmCf_ToRe7qDrYTiFDgux8h0qB3l3hjrZtVpwajXNgBfKnWUD0cI",
  privateKey: "gHsjw1FDGD963Ja6Ov69_Tmq5Q7FInQTsExaDmchTcs",
};

webpush.setVapidDetails(
  "mailto:shivamgoyal@tutedude.com",
  apiKeys.publicKey,
  apiKeys.privateKey
);

exports.saveSubscription = async (req, res) => {
  const sub = req.body;

  try {
    const subs = await Push.findOne({ endpoint: sub.endpoint });
    console.log(subs);
    if (!subs) {
      const newSub = await Push.create({
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime,
        keys: sub.keys,
      });
      console.log(newSub);
      res.status(200).json({ success: true, newSub });
    } else res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const sendNotification = (subscription, payload) => {
  webpush
    .sendNotification(subscription, payload)
    .then(() => console.log("Notification sent successfully"))
    .catch((error) => console.error("Error sending notification:", error));
};

exports.sendNotification = async (req, res) => {
  const payload = JSON.stringify({
    title: "Reminder",
    body: "This is to remind You...",
  });

  const subDatabase = await Push.find();

  try {
    subDatabase.forEach((subscription) => {
      sendNotification(subscription, payload);
    });

    res.json({
      status: "Success",
      message: "Message sent to push service",
      subDatabase,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to send notifications",
      error: error.message,
    });
  }
};
