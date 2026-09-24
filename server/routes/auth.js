const express = require("express");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const { generateOtp, sendSmsOtp } = require("../services/smsService");

const router = express.Router();

const createSession = (res, user) => {
  const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Send / Resend OTP to mobile number via SMS
router.post(["/send-otp", "/resend-otp", "/request-otp"], async (req, res) => {
  const rawPhone = String(req.body.phone || "").replace(/\D/g, "");

  if (rawPhone.length < 10) {
    return res.status(400).json({ message: "Please enter a valid 10-digit mobile number" });
  }

  const phone = rawPhone.slice(-10);
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    // Invalidate any previous pending OTPs for this phone number
    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);

    // Insert new OTP record
    await pool.query(
      "INSERT INTO otps (phone, otp_code, expires_at) VALUES ($1, $2, $3)",
      [phone, otp, expiresAt]
    );

    // Send SMS via SMS service (Fast2SMS / Twilio / Console Simulation)
    await sendSmsOtp(phone, otp);

    return res.json({
      success: true,
      message: `OTP sent successfully via SMS to +91 ${phone}`,
      phone,
      demoOtp: otp, // available for testing / simulated SMS banner
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Unable to send OTP. Please try again.", error: error.message });
  }
});

// Verify OTP and complete login / sign-up
router.post("/verify-otp", async (req, res) => {
  const rawPhone = String(req.body.phone || "").replace(/\D/g, "");
  const enteredOtp = String(req.body.otp || "").trim();

  if (rawPhone.length < 10) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const phone = rawPhone.slice(-10);

  if (!enteredOtp || enteredOtp.length !== 6) {
    return res.status(400).json({ message: "Please enter a valid 6-digit OTP" });
  }

  try {
    // Find active unexpired OTP
    const result = await pool.query(
      "SELECT id, phone, otp_code, expires_at FROM otps WHERE phone = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [phone]
    );

    if (!result.rows[0]) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please request a new OTP.",
      });
    }

    const record = result.rows[0];

    if (record.otp_code !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please enter the valid OTP or click Resend.",
      });
    }

    // OTP matched! Clean up OTP record
    await pool.query("DELETE FROM otps WHERE phone = $1", [phone]);

    // Retrieve or register user
    let userQuery = await pool.query("SELECT id, phone FROM users WHERE phone = $1", [phone]);
    let user = userQuery.rows[0];

    if (!user) {
      const newUserQuery = await pool.query(
        "INSERT INTO users (phone) VALUES ($1) ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone RETURNING id, phone",
        [phone]
      );
      user = newUserQuery.rows[0];
    }

    createSession(res, user);

    return res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Unable to verify OTP", error: error.message });
  }
});


router.post("/signup", async (req, res) => {
  const phone = String(req.body.phone || "").replace(/\D/g, "");

  if (phone.length < 10) {
    return res.status(400).json({ message: "Enter a valid phone number" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (phone) VALUES ($1) ON CONFLICT (phone) DO NOTHING RETURNING id, phone",
      [phone],
    );

    if (!result.rows[0]) {
      return res.status(409).json({ message: "This phone number is already registered. Please log in." });
    }

    const user = result.rows[0];
    createSession(res, user);
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create account", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const phone = String(req.body.phone || "").replace(/\D/g, "");

  if (phone.length < 10) {
    return res.status(400).json({ message: "Enter a valid phone number" });
  }

  try {
    const result = await pool.query("SELECT id, phone FROM users WHERE phone = $1", [phone]);

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Account not found. Please sign up first." });
    }

    const user = result.rows[0];
    createSession(res, user);

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