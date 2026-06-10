const express = require("express");
const router = express.Router();

const {
  submitActivity,
  getMyActivities,
  getAllActivities,
} = require("../controllers/activityController");

router.post("/submit", submitActivity);

router.get("/my/:internId", getMyActivities);

router.get("/all", getAllActivities);

module.exports = router;