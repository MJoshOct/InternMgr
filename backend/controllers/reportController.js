const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Activity = require("../models/Activity");

// Attendance Report
const attendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("internId", "name email");

    res.status(200).json({
      success: true,
      totalRecords: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Leave Report
const leaveReport = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("internId", "name email");

    res.status(200).json({
      success: true,
      totalRecords: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Activity Report
const activityReport = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("internId", "name email");

    res.status(200).json({
      success: true,
      totalRecords: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  attendanceReport,
  leaveReport,
  activityReport,
};