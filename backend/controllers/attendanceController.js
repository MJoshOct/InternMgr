const Attendance = require("../models/Attendance");

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { internId } = req.body;

    const attendance = await Attendance.create({
      internId,
      status: "Present",
    });

    res.status(201).json({
      success: true,
      message: "Attendance Marked",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// View Attendance History
const getAttendanceHistory = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      internId: req.params.internId,
    });

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin View All Attendance
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate(
      "internId",
      "name email"
    );

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendanceHistory,
  getAllAttendance,
};