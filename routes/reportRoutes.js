const express = require("express");
const router = express.Router();

const {
  attendanceReport,
  leaveReport,
  activityReport,
} = require("../controllers/reportController");

router.get("/attendance", attendanceReport);

router.get("/leave", leaveReport);

router.get("/activity", activityReport);

module.exports = router;