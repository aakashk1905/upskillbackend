const userModel = require("../models/userModel");

exports.setLang = (email, language) => {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email })
      .exec()
      .then((user) => {
        if (!user) {
          reject(new Error("No Records for this email Found"));
        }
        user.language = language;
        user
          .save()
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// exports.updateStreak = (email) => {
//   return new Promise((resolve, reject) => {
//     userModel
//       .findOne({ email })
//       .exec()
//       .then((user) => {
//         if (!user) {
//           reject(new Error("No Records for this email Found"));
//         }

//         if (!user.streakData) {
//           user.streakData = {
//             streak: 0,
//             streakDates: [],
//           };
//         }

//         const streakDates = user.streakData.streakDates;

//         if (
//           !streakDates ||
//           !Array.isArray(streakDates) ||
//           streakDates.length === 0
//         ) {
//           user.streakData.streakDates = [];
//           user.streakData.streakDates.push(new Date());
//           user.streakData.streak = 1;
//         } else {
//           const timeDifference =
//             new Date() - streakDates[streakDates.length - 1];

//           if (timeDifference > 24 * 60 * 60 * 1000) {
//             user.streakData.streak = 1;
//             user.streakData.streakDates.push(new Date());
//           } else {
//             // Increment streak if within 24 hours
//             if (
//               streakDates[streakDates.length - 1].getDate() !==
//               new Date().getDate()
//             ) {
//               user.streakData.streakDates.push(new Date());
//               user.streakData.streak += 1;
//             }
//           }
//         }

//         user
//           .save()
//           .then((user) => {
//             resolve(user);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

exports.updateStreak = (email) => {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email })
      .exec()
      .then((user) => {
        if (!user) {
          reject(new Error("No Records for this email Found"));
          return;
        }

        if (!user.streakData) {
          user.streakData = {
            streak: 0,
            streakDates: [],
          };
        }

        const streakDates = user.streakData.streakDates;

        if (
          !streakDates ||
          !Array.isArray(streakDates) ||
          streakDates.length === 0
        ) {
          user.streakData.streakDates = [];
          user.streakData.streak = 1;
          user.streakData.streakDates.push(new Date());
        } else {
          const lastStreakDate = streakDates[streakDates.length - 1].getDate();
          const currentDate = new Date().getDate();
          if (currentDate - lastStreakDate > 1) {
            user.streakData.streak = 1;
            user.streakData.streakDates.push(new Date());
          } else if (currentDate - lastStreakDate === 1) {
            user.streakData.streak += 1;
            user.streakData.streakDates.push(new Date());
          }
        }
        if (streakDates.length > 31) {
          streakDates.shift();
        }

        user
          .save()
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
