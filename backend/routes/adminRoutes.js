const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET     = process.env.JWT_SECRET;

// ── Middleware: verify JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized — no token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized — invalid token" });
  }
}

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, message: "Login successful" });
});

// GET /api/admin/users  — protected
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats  — protected
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const total      = await User.countDocuments();
    const today      = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = await User.countDocuments({ createdAt: { $gte: today } });

    const byChannel  = await User.aggregate([
      { $group: { _id: "$updateChannel", count: { $sum: 1 } } }
    ]);
    const byInterest = await User.aggregate([
      { $group: { _id: "$interestLevel", count: { $sum: 1 } } }
    ]);
    const byVisit    = await User.aggregate([
      { $group: { _id: "$visitType", count: { $sum: 1 } } }
    ]);
    const byGender   = await User.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    res.json({ total, todayCount, byChannel, byInterest, byVisit, byGender });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id  — protected
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;