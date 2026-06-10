const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Activity = require("../models/Activity");

// Student Dashboard
const studentDashboard = async (req, res) => {
  try {
    const { internId } = req.params;

    const totalAttendance = await Attendance.countDocuments({
      internId,
    });

    const totalLeaves = await Leave.countDocuments({
      internId,
    });

    const totalActivities = await Activity.countDocuments({
      internId,
    });

    res.status(200).json({
      success: true,
      totalAttendance,
      totalLeaves,
      totalActivities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin Dashboard
const adminDashboard = async (req, res) => {
  try {
    const totalInterns = await User.countDocuments({
      role: "intern",
    });

    const todayAttendance = await Attendance.countDocuments();

    const pendingLeaves = await Leave.countDocuments({
      status: "Pending",
    });

    const totalActivities = await Activity.countDocuments();

    res.status(200).json({
      success: true,
      totalInterns,
      todayAttendance,
      pendingLeaves,
      totalActivities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  studentDashboard,
  adminDashboard,
};