const Leave = require("../models/Leave");

// Apply Leave
const applyLeave = async (req, res) => {
  try {
    const { internId, reason, fromDate, toDate } = req.body;

    const leave = await Leave.create({
      internId,
      reason,
      fromDate,
      toDate,
    });

    res.status(201).json({
      success: true,
      message: "Leave Applied Successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// View My Leave Status
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      internId: req.params.internId,
    });

    res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// View All Leave Requests
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate(
      "internId",
      "name email"
    );

    res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Approve Leave
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Leave Approved",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Reject Leave
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Leave Rejected",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
};