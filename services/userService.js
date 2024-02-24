const userModel = require("../models/userModel");
const { getTask, updateTask } = require("./Sheets");

exports.joined = (email) => {
  console.log(email);
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email })
      .populate("userDetails")
      .exec()
      .then((user) => {
        if (!user) {
          reject(new Error("No Records for this email Found"));
        }
        user.joined = true;
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
exports.closed = (email) => {
  return new Promise((resolve, reject) => {
    userModel
      .findOne({ email })
      .populate("userDetails")
      .exec()
      .then((user) => {
        if (!user) {
          reject(new Error("No Records for this email Found"));
        }
        if (user.closed) user.closed += 1;
        else user.closed = 1;
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

// exports.updateStreakAll = () => {
//   return new Promise((resolve, reject) => {
//     userModel
//       .find()
//       .exec()
//       .then((user) => {
//         if (!user) {
//           reject(new Error("No Records for this email Found"));
//           return;
//         }
//         user.forEach(async (u) => {
//           u.streakData.streak -= 16;
//           u.streakData.streakDates.splice(-16)
//           await u.save();
//         });
//         console.log("Done");
//         resolve("done");
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
      .populate("userDetails")
      .exec()
      .then((user) => {
        if (!user) {
          reject(new Error("No Records for this email Found"));
          return;
        }

        if (!user.userDetails.streakData) {
          user.userDetails.streakData = {
            streak: 0,
            streakDates: [],
          };
        }

        const streakDates = user.userDetails.streakData.streakDates;

        if (
          !streakDates ||
          !Array.isArray(streakDates) ||
          streakDates.length === 0
        ) {
          user.userDetails.streakData.streakDates = [];
          user.userDetails.streakData.streak = 1;
          user.userDetails.streakData.streakDates.push(new Date());
        } else {
          const lastStreakDate = streakDates[streakDates.length - 1].getDate();
          const currentDate = new Date().getDate();
          if (currentDate - lastStreakDate > 1) {
            user.userDetails.streakData.streak = 1;
            user.userDetails.streakData.streakDates.push(new Date());
          } else if (currentDate - lastStreakDate === 1) {
            user.userDetails.streakData.streak += 1;
            user.userDetails.streakData.streakDates.push(new Date());
          }

          if (
            new Date().getMonth() !==
            streakDates[streakDates.length - 1].getMonth()
          ) {
            if (
              new Date() - streakDates[streakDates.length - 1] >
              48 * 60 * 60 * 1000
            ) {
              user.userDetails.streakData.streak = 1;
              user.userDetails.streakData.streakDates.push(new Date());
            } else {
              user.userDetails.streakData.streak += 1;
              user.userDetails.streakData.streakDates.push(new Date());
            }
          }
        }
        if (streakDates.length > 31) {
          streakDates.shift();
        }

        user.userDetails
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
exports.gettaskbymail = (email) => {
  return new Promise((resolve, reject) => {
    getTask(email)
      .then((tasks) => {
        resolve(tasks);
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error);
      });
  });
};
exports.getLeaderboard = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const leaderboard = await userModel.aggregate([
        {
          $lookup: {
            from: "userdetails",
            localField: "email",
            foreignField: "email",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $sort: { "userDetails.points": -1, "userDetails.lastSubmission": 1 },
        },
      ]);
      const userEntry = leaderboard.findIndex((lb) => lb.email === email);
      const dt = {
        lb: leaderboard.slice(0, 10),
        myRank: userEntry,
      };
      resolve(dt);
    } catch (err) {
      reject(err);
    }
  });
};

exports.updatetaskbymail = (email, sheetname, status) => {
  return new Promise((resolve, reject) => {
    updateTask(email, sheetname, status)
      .then((tasks) => {
        resolve(tasks);
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error);
      });
  });
};
