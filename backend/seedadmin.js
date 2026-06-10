// ============================================
//  ONE-TIME ADMIN SEED SCRIPT
//  1. Place this file in your backend root
//  2. Run: node seed-admin.js
//  3. DELETE this file after running it
// ============================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ✏️  Change these before running
const ADMIN_NAME = "SuperAdmin";
const ADMIN_EMAIL = "admin@portal.com";
const ADMIN_PASSWORD = "Admin1234";
const ADMIN_DEPARTMENT = "Management";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Dynamically load model (avoids re-registration issues)
    const User = require("./models/User");

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("⚠️  An admin with this email already exists:");
      console.log(`   Email: ${existing.email} | Role: ${existing.role}`);
      console.log("   → Update the ADMIN_EMAIL above and re-run, or delete the existing user first.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      department: ADMIN_DEPARTMENT,
      role: "admin",
    });

    console.log("\n🎉 Admin created successfully!");
    console.log("─────────────────────────────");
    console.log(`   Name      : ${admin.name}`);
    console.log(`   Email     : ${admin.email}`);
    console.log(`   Password  : ${ADMIN_PASSWORD}`);
    console.log(`   Role      : ${admin.role}`);
    console.log("─────────────────────────────");
    console.log("⚠️  DELETE this file now and change your password after logging in.\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();
