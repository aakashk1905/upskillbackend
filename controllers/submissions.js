const Submission = require("../models/submissionModel");
const UserDetails = require("../models/userDetailsModel");
const User = require("../models/userModel");

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
  const upgrade = {
    task1: 10,
    task2: 10,
    task3: 10,
    task4: 10,
    task5: 10,
    task6: 10,
    task7: 10,
    task8: 10,
    task9: 10,
    task10: 10,
    task11: 10,
    task12: 10,
    task13: 10,
    task14: 10,
    task15: 10,
    task16: 10,
    task17: 10,
    task18: 10,
    task19: 10,
    task20: 10,
    task21: 10,
    task22: 10,
    grouptask1: 40,
    grouptask2: 50,
    grouptask3: 60,
    grouptask4: 70,
  };
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
