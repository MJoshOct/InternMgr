const express = require("express");
const router = express.Router();

const {
  studentDashboard,
  adminDashboard,
} = require("../controllers/dashboardController");

router.get("/student/:internId", studentDashboard);

router.get("/admin", adminDashboard);

module.exports = router;