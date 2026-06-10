const Activity = require("../models/Activity");

// Submit Activity
const submitActivity = async (req, res) => {
  try {
    const { internId, activity } = req.body;

    const newActivity = await Activity.create({
      internId,
      activity,
    });

    res.status(201).json({
      success: true,
      message: "Activity Submitted Successfully",
      newActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// View My Activities
const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      internId: req.params.internId,
    });

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Admin View All Activities
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate(
      "internId",
      "name email"
    );

    res.status(200).json({
      success: true,
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
  submitActivity,
  getMyActivities,
  getAllActivities,
};