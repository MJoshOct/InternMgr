const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendanceHistory,
  getAllAttendance,
} = require("../controllers/attendanceController");

router.post("/mark", markAttendance);

router.get("/history/:internId", getAttendanceHistory);

router.get("/all", getAllAttendance);

module.exports = router;