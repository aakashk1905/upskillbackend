const userModel = require("../models/userModel");

exports.setLang = (email, language) => {
  return new Promise((resolve, reject) => {
    userModel.findOne({ email }).exec().then((user) => {
        if (!user) {
          reject(new Error("No Records for this email Found"));
        }
        user.language = language;
        user.save().then((user) => {
            resolve(user);
          }).catch((err) => {
            reject(err);
          });
      }).catch((err) => {
        reject(err);
      });
  });
};
