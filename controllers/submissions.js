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
exports.submitTask = async (req, res) => {
  const { email, taskName, taskLink } = req.body;

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

    const existingTaskIndex = submission.tasks.findIndex(
      (task) => task.taskName === taskName
    );

    const currentDate = new Date();

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

exports.feedback = async (req, res) => {
  const { email, feedback, status, taskName } = req.body;

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
