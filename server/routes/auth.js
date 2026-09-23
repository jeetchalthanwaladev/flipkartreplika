const express = require("express");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  const phone = String(req.body.phone || "").replace(/\D/g, "");

  if (phone.length < 10) {
    return res.status(400).json({ message: "Enter a valid phone number" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (phone) VALUES ($1)
       ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING id, phone`,
      [phone],
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in", error: error.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT id, phone FROM users WHERE id = $1", [req.user.id]);

  if (!result.rows[0]) {
    return res.status(401).json({ message: "User not found" });
  }

  return res.json({ user: result.rows[0] });
});

router.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ success: true });
});

module.exports = router;