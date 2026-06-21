const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

// Health check
router.get("/", (req, res) => res.send("✅ User routes working"));

// GET all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ FIND ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// CHECK if phone or email already registered
router.post("/check-duplicate", async (req, res) => {
  try {
    const { phone, email } = req.body;
    const phoneExists = phone ? await User.findOne({ phone }) : null;
    const emailExists = email ? await User.findOne({ email: email.toLowerCase() }) : null;
    res.status(200).json({
      phoneExists: !!phoneExists,
      emailExists: !!emailExists
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    // Sanitize phone: remove non-digits
    if (req.body.phone) {
      req.body.phone = req.body.phone.replace(/\D/g, "");
    }

    // Double-check uniqueness before saving
    if (req.body.phone) {
      const phoneExists = await User.findOne({ phone: req.body.phone });
      if (phoneExists) {
        return res.status(409).json({ error: "This phone number is already registered. Each person can only register once." });
      }
    }
    if (req.body.email && req.body.email !== "") {
      const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
      if (emailExists) {
        return res.status(409).json({ error: "This email address is already registered. Each person can only register once." });
      }
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err.message);
    console.error("❌ FULL ERROR DETAILS:", err.stack);

    // MongoDB duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === "phone") {
        return res.status(409).json({ error: "This phone number is already registered." });
      }
      if (field === "email") {
        return res.status(409).json({ error: "This email is already registered." });
      }
      return res.status(409).json({ error: "You are already registered." });
    }

    // Validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages[0] });
    }

    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

module.exports = router;