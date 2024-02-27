const Submission = require("../models/submissionModel");
const UserDetails = require("../models/userDetailsModel");
const User = require("../models/userModel");

const levels = [
  {
    name: "Bronze III",
    start: 0,
    end: 49,
  },
  {
    name: "Bronze II",
    start: 50,
    end: 99,
  },
  {
    name: "Bronze I",
    start: 100,
    end: 199,
  },
  {
    name: "Silver III",
    start: 200,
    end: 299,
  },
  {
    name: "Silver II",
    start: 300,
    end: 449,
  },
  {
    name: "Silver I",
    start: 450,
    end: 599,
  },
  {
    name: "Gold III",
    start: 600,
    end: 799,
  },
  {
    name: "Gold II",
    start: 800,
    end: 999,
  },
  {
    name: "Gold I",
    start: 1000,
    end: 1249,
  },
  {
    name: "Platinum III",
    start: 1250,
    end: 1499,
  },
  {
    name: "Platinum II",
    start: 1500,
    end: 1799,
  },
  {
    name: "Platinum I",
    start: 1800,
    end: 2099,
  },
  {
    name: "Diamond III",
    start: 2100,
    end: 2499,
  },
  {
    name: "Diamond II",
    start: 2500,
    end: 2999,
  },
  {
    name: "Diamond I",
    start: 3000,
    end: 3499,
  },
  {
    name: "Emerald",
    start: 3500,
    end: 3999,
  },
];

const upgrade = {
  task0: 10,
  task1: 10,
  task2: 10,
  task3: 10,
  task4: 20,
  task5: 20,
  task6: 20,
  task7: 30,
  task8: 20,
  task9: 20,
  task10: 20,
  task11: 30,
  task12: 30,
  task13: 40,
  task14: 40,
  task15: 50,
  task16: 70,
  task17: 100,
  task18: 70,
  task19: 200,
  task20: 150,
  task21: 150,
  task22: 150,
  grpproject1: 60,
  grpproject2: 150,
  grpproject3: 200,
  grpproject4: 400,
};
// exports.submitTask = async (req, res) => {
//   const { email, taskName, taskLink, teamName, teamMembers } = req.body;

//   if (!email || !taskName || !taskLink) {
//     return res.status(400).json({
//       message: "Missing required fields: email, taskName, taskLink",
//     });
//   }

//   try {
//     let submission = await Submission.findOne({ email });
//     let userDetails = await UserDetails.findOne({ email });

//     if (!submission) {
//       submission = new Submission({ email });
//     }

//     const existingTaskIndex = submission.tasks.findIndex(
//       (task) => task.taskName === taskName
//     );

//     const currentDate = new Date();

//     if (existingTaskIndex !== -1) {
//       submission.tasks[existingTaskIndex] = {
//         taskName,
//         taskLink,
//         status: "submitted",
//         feedback: "",
//         submittedOn: currentDate,
//       };
//     } else {
//       submission.tasks.push({
//         taskName,
//         taskLink,
//         status: "submitted",
//         feedback: "",
//         submittedOn: currentDate,
//       });
//     }

//     if (userDetails) {
//       userDetails.lastSubmission = currentDate;
//       await userDetails.save();
//     }

//     await submission.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         existingTaskIndex !== -1
//           ? "Task Resubmitted successfully"
//           : "Task Submitted successfully",
//     });
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
//       return res.status(400).json({
//         success: false,
//         error: "Email ID already exists. Please use a different Email.",
//       });
//     } else {
//       return res.status(500).json({ success: false, error: err.message });
//     }
//   }
// };

// exports.feedback = async (req, res) => {
//   const { email, feedback, status, taskName, teamMembers } = req.body;

//   if (!email || !taskName) {
//     return res.status(400).json({
//       message: "Missing required fields: email, taskName",
//     });
//   }

//   try {
//     const submission = await Submission.findOne({ email });
//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "No User With This Email",
//       });
//     }

//     if (
//       taskName === "grpproject1" ||
//       taskName === "grpproject2" ||
//       taskName === "grpproject3" ||
//       taskName === "grpproject4"
//     ) {
//       if (teamMembers) {
//         teamMembers.forEach(async (tm) => {
//           const subm = await Submission.findOne({ email: tm });
//           const idx = subm.tasks.findIndex(
//             (task) => task.taskName === taskName
//           );
//           const updatedTask = subm.tasks[idx];

//           updatedTask.status = status;
//           updatedTask.feedback = feedback;
//           subm.tasks[idx] = updatedTask;

//           await subm.save();

//           if (status === "approved") {
//             const user = await User.findOne({ email: tm }).populate(
//               "userDetails"
//             );
//             if (!user) {
//               return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//               });
//             }
//             let pts = user.userDetails.points || 0;

//             pts += upgrade[taskName];
//             const ind = levels.findIndex((l) => l.end >= pts && l.start <= pts);

//             user.userDetails.level = levels[ind].name;
//             user.userDetails.points = pts;
//             await user.userDetails.save();
//           }
//         });
//       }
//       return res
//         .status(200)
//         .json({ success: true, message: "Feedback updated successfully" });
//     } else {
//       const idx = submission.tasks.findIndex(
//         (task) => task.taskName === taskName
//       );
//       if (idx === -1) {
//         return res.status(404).json({
//           success: false,
//           message: "No Task With This Task Name",
//         });
//       }
//       const updatedTask = submission.tasks[idx];

//       updatedTask.status = status;
//       updatedTask.feedback = feedback;
//       submission.tasks[idx] = updatedTask;

//       await submission.save();

//       if (status === "approved") {
//         const user = await User.findOne({ email }).populate("userDetails");
//         if (!user) {
//           return res.status(404).json({
//             success: false,
//             message: "User not found",
//           });
//         }
//         let pts = user.userDetails.points || 0;

//         pts += upgrade[taskName];
//         const ind = levels.findIndex((l) => l.end >= pts && l.start <= pts);

//         user.userDetails.level = levels[ind].name;
//         user.userDetails.points = pts;
//         await user.userDetails.save();
//       }

//       return res
//         .status(200)
//         .json({ success: true, message: "Feedback updated successfully" });
//     }
//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

exports.feedback = async (req, res) => {
  const { email, feedback, status, taskName, teamMembers } = req.body;

  if (!email || !taskName) {
    return res.status(400).json({
      message: "Missing required fields: email, taskName",
    });
  }

  try {
    const submission = await Submission.findOne({ email });
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "No User With This Email",
      });
    }

    if (
      ["grpproject1", "grpproject2", "grpproject3", "grpproject4"].includes(
        taskName
      ) &&
      teamMembers
    ) {
      await Promise.all(
        teamMembers.map(async (tm) => {
          const subm = await Submission.findOne({ email: tm });
          if (!subm) {
            return res.status(404).json({
              success: false,
              message: `User with email ${tm} not found`,
            });
          }
          const idx = subm.tasks.findIndex(
            (task) => task.taskName === taskName
          );
          if (idx !== -1) {
            const updatedTask = subm.tasks[idx];
            updatedTask.status = status;
            updatedTask.feedback = feedback;
            subm.tasks[idx] = updatedTask;
            await subm.save();

            if (status === "approved") {
              const user = await User.findOne({ email: tm }).populate(
                "userDetails"
              );
              if (!user) {
                return res.status(404).json({
                  success: false,
                  message: "User not found",
                });
              }
              let pts = user.userDetails.points || 0;
              pts += upgrade[taskName];
              const ind = levels.findIndex(
                (l) => l.end >= pts && l.start <= pts
              );
              user.userDetails.level = levels[ind].name;
              user.userDetails.points = pts;
              await user.userDetails.save();
            }
          }
        })
      );
    } else {
      const idx = submission.tasks.findIndex(
        (task) => task.taskName === taskName
      );
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: "No Task With This Task Name",
        });
      }
      const updatedTask = submission.tasks[idx];
      updatedTask.status = status;
      updatedTask.feedback = feedback;
      submission.tasks[idx] = updatedTask;
      await submission.save();

      if (status === "approved") {
        const user = await User.findOne({ email }).populate("userDetails");
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        let pts = user.userDetails.points || 0;
        pts += upgrade[taskName];
        const ind = levels.findIndex((l) => l.end >= pts && l.start <= pts);
        user.userDetails.level = levels[ind].name;
        user.userDetails.points = pts;
        await user.userDetails.save();
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Feedback updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSubmissionsBymail = async (req, res) => {
  try {
    const email = req.query.email;
    const submissions = await Submission.findOne({ email });
    res.status(200).json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.unchecked = async (req, res) => {
  try {
    const submissions = await Submission.find({ "tasks.status": "submitted" });

    // Filter out tasks with status 'approved' from each submission
    const filteredSubmissions = submissions.map((submission) => {
      submission.tasks = submission.tasks.filter(
        (task) => task.status !== "approved" && task.status !== "rejected"
      );
      return submission;
    });

    res.status(200).json({ success: true, submissions: filteredSubmissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// const doSubmit = async (ent) => {
//   const { email, taskName, taskLink, submittedOn, feedback, status } = ent;

//   try {
//     // Validate input data
//     if (!email || !taskName || !taskLink || !submittedOn) {
//       throw new Error("Invalid submission data. Missing required fields.");
//     }

//     // Find or create a submission for the given email
//     console.log("params::", email);
//     let submission = await Submission.findOne({ email });
//     if (submission) console.log("existeing", submission.email);
//     if (!submission) {
//       submission = new Submission({ email });
//     }
//     console.log("new", submission.email);

//     // Update task information
//     const existingTaskIndex = submission.tasks.findIndex(
//       (task) => task.taskName === taskName
//     );
//     console.log(existingTaskIndex, "Ind");
//     if (existingTaskIndex !== -1) {
//       submission.tasks[existingTaskIndex] = {
//         taskName,
//         taskLink,
//         status,
//         feedback,
//         submittedOn,
//       };
//     } else {
//       submission.tasks.push({
//         taskName,
//         taskLink,
//         status: status || "submitted",
//         feedback: feedback || "",
//         submittedOn,
//       });
//     }

//     // Find or create user details
//     let userDetails = await UserDetails.findOne({ email });
//     if (userDetails) {
//       userDetails.lastSubmission = submittedOn;
//       await userDetails.save();
//     }

//     // Save changes

//     await submission.save();
//   } catch (err) {
//     console.error("Error submitting task:", err);
//     throw err; // Rethrow the error for handling at a higher level
//   }
// };

// setTimeout(async () => {
//   const subs = require("../submissions.json");

//   for (const s of subs) {
//     try {
//       await doSubmit(s);
//       console.log(`Submission for ${s.email} processed successfully.`);
//     } catch (error) {
//       console.error(`Error processing submission for ${s.email}:`, error);
//     }
//   }
// }, 5000); // Run after 5 seconds

exports.submitTask = async (req, res) => {
  const { email, taskName, taskLink, teamName, teamMembers } = req.body;

  if (!email || !taskName || !taskLink) {
    return res.status(400).json({
      message: "Missing required fields: email, taskName, taskLink",
    });
  }

  try {
    let submission = await Submission.findOne({ email });
    let userDetails = await UserDetails.findOne({ email });

    if (!submission) {
      submission = new Submission({ email });
    }

    const currentDate = new Date();
    if (teamMembers) teamMembers.push(email);

    // Check if taskName is one of the special cases
    if (
      taskName === "grpproject1" ||
      taskName === "grpproject2" ||
      taskName === "grpproject3" ||
      taskName === "grpproject4"
    ) {
      // Check if teamName and teamMembers are provided
      if (teamName && teamMembers && teamMembers.length > 0) {
        // Iterate through each team member
        for (const memberEmail of teamMembers) {
          // Create or update submission for each team member
          let memberSubmission = await Submission.findOne({
            email: memberEmail,
          });
          let memberDetails = await UserDetails.findOne({ email: memberEmail });
          if (!memberSubmission) {
            memberSubmission = new Submission({ email: memberEmail });
          }

          const existingTaskIndex = memberSubmission.tasks.findIndex(
            (task) => task.taskName === taskName
          );

          if (existingTaskIndex !== -1) {
            memberSubmission.tasks[existingTaskIndex] = {
              taskName,
              taskLink,
              status: "submitted",
              feedback: "",
              submittedOn: currentDate,
              teamName,
              teamMembers,
            };
          } else {
            memberSubmission.tasks.push({
              taskName,
              taskLink,
              status: "submitted",
              feedback: "",
              submittedOn: currentDate,
              teamName,
              teamMembers,
            });
          }
          if (memberDetails) {
            memberDetails.lastSubmission = currentDate;
            await memberDetails.save();
          }
          await memberSubmission.save();
        }
      }
      return res.status(200).json({
        success: true,
        message: "Task Submitted successfully",
      });
    } else {
      // Normal task submission
      const existingTaskIndex = submission.tasks.findIndex(
        (task) => task.taskName === taskName
      );

      if (existingTaskIndex !== -1) {
        submission.tasks[existingTaskIndex] = {
          taskName,
          taskLink,
          status: "submitted",
          feedback: "",
          submittedOn: currentDate,
        };
      } else {
        submission.tasks.push({
          taskName,
          taskLink,
          status: "submitted",
          feedback: "",
          submittedOn: currentDate,
        });
      }

      if (userDetails) {
        userDetails.lastSubmission = currentDate;
        await userDetails.save();
      }

      await submission.save();

      return res.status(200).json({
        success: true,
        message:
          existingTaskIndex !== -1
            ? "Task Resubmitted successfully"
            : "Task Submitted successfully",
      });
    }
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({
        success: false,
        error: "Email ID already exists. Please use a different Email.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
