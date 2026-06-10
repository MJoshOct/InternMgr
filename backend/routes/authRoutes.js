const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  registerIntern,
  login,
  getAllInterns,
  deleteIntern
} = require("../controllers/authController");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Route Working",
  });
});

// Authentication Routes
router.post("/register-admin", registerAdmin);
router.post("/register-intern", registerIntern);
router.post("/login", login);

// Get All Interns
router.get("/interns", getAllInterns);
router.delete("/intern/:id", deleteIntern);

module.exports = router;