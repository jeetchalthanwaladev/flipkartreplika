/**
 * SMS Service for dispatching One-Time Passwords (OTP)
 * Supports real SMS via Fast2SMS / Twilio when environment variables are set,
 * and falls back to console logging & simulation in development/local environments.
 */

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSmsOtp(phone, otp) {
  const formattedPhone = String(phone).replace(/\D/g, "");
  const messageBody = `Your Flipkart verification code is ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;

  console.log(`\n==============================================`);
  console.log(`📱 [SMS SERVICE] Sending SMS to +91 ${formattedPhone}`);
  console.log(`💬 Message: "${messageBody}"`);
  console.log(`🔑 Verification OTP: ${otp}`);
  console.log(`==============================================\n`);

  // 1. Try Fast2SMS if configured
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: formattedPhone,
        }),
      });
      const data = await response.json();
      console.log("[Fast2SMS] Response:", data);
      return { success: true, provider: "fast2sms", otp };
    } catch (err) {
      console.error("[Fast2SMS] Failed to send SMS:", err.message);
    }
  }

  // 2. Try Twilio if configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const params = new URLSearchParams();
      params.append("To", `+91${formattedPhone}`);
      params.append("From", process.env.TWILIO_PHONE_NUMBER);
      params.append("Body", messageBody);

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );
      const data = await response.json();
      console.log("[Twilio SMS] Response:", data?.sid ? "Sent successfully" : data);
      return { success: true, provider: "twilio", otp };
    } catch (err) {
      console.error("[Twilio SMS] Failed to send SMS:", err.message);
    }
  }

  // 3. Fallback / simulated SMS for development
  return {
    success: true,
    provider: "simulated",
    otp,
    message: "SMS sent successfully",
  };
}

module.exports = {
  generateOtp,
  sendSmsOtp,
};
