const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    // Legacy field — kept so old records don't break
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // New: supports multiple assignees
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // New title field; activity kept as fallback for old records
    title: {
      type: String,
    },
    activity: {
      type: String,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["Task", "Assignment", "Project", "Training", "Other"],
      default: "Task",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    deadline: {
      type: Date,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
