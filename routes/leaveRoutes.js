const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

router.post("/apply", applyLeave);

router.get("/my/:internId", getMyLeaves);

router.get("/all", getAllLeaves);

router.put("/approve/:id", approveLeave);

router.put("/reject/:id", rejectLeave);

module.exports = router;