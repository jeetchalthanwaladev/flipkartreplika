import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { useShop } from "../context/useShop";
import "../styles/loginmodal.css";

const LoginModal = () => {
  const { loginOpen, closeLogin, requestOtp, verifyOtp } = useShop();
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [demoOtp, setDemoOtp] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!loginOpen) return null;

  const handleResetModal = () => {
    setStep("phone");
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setDemoOtp("");
    closeLogin();
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await requestOtp(cleanPhone);
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
      }
      setStep("otp");
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setError(err.message || "Failed to send OTP via SMS");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal && value !== "") return;

    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || "";
      }
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      if (otpInputRefs.current[nextFocus]) {
        otpInputRefs.current[nextFocus].focus();
      }
      return;
    }

    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);

    if (cleanVal && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      if (otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await verifyOtp(phone.replace(/\D/g, ""), fullOtp);
      handleResetModal();
    } catch (err) {
      setError(err.message || "Incorrect OTP. Please enter valid OTP or click Resend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="login-overlay" role="presentation" onMouseDown={handleResetModal}>
      <aside
        className="login-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="login-close" type="button" onClick={handleResetModal} aria-label="Close login">
          <FiX />
        </button>

        {step === "phone" ? (
          <>
            <div className="login-drawer-copy">
              <h2 id="login-title">{isSignup ? "Create your Flipkart account" : "Login to access your Flipkart"}</h2>
              <p>{isSignup ? "Sign up with your contact number to get started." : "Get access to your cart, orders and faster checkout."}</p>
            </div>
            <form onSubmit={handleSendOtp}>
              <label htmlFor="phone">Phone Number</label>
              <div className="phone-input">
                <span>+91</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  maxLength="10"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <p className="login-terms">By continuing, you agree to Flipkart&apos;s Terms of Use and Privacy Policy.</p>
              <button className="login-submit" type="submit" disabled={isSubmitting || phone.length < 10}>
                {isSubmitting ? "Sending OTP..." : "Continue"}
              </button>
              <button
                className="login-mode-toggle"
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setPhone("");
                  setError("");
                }}
              >
                {isSignup ? "Already registered? Login" : "New customer? Sign Up"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="login-drawer-copy">
              <h2 id="login-title">Verify OTP</h2>
              <p className="otp-instruction-modal">
                Please enter the verification code we've sent you on{" "}
                <strong>+91-{phone}</strong>{" "}
                <button
                  type="button"
                  className="otp-edit-btn"
                  onClick={() => {
                    setStep("phone");
                    setError("");
                  }}
                >
                  Edit
                </button>
              </p>
            </div>

            {demoOtp && (
              <div className="demo-otp-banner">
                <span>💬 SMS Sent! OTP: <strong>{demoOtp}</strong></span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp}>
              <div className="otp-modal-section">
                <div className="otp-boxes">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`otp-digit-box ${digit ? "filled" : ""}`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <div className="otp-modal-timer-row">
                  {!canResend ? (
                    <span className="otp-timer">{formatTimer(timer)}</span>
                  ) : (
                    <button
                      type="button"
                      className="otp-resend-btn"
                      onClick={handleSendOtp}
                      disabled={isSubmitting}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                className="login-submit verify-btn"
                type="submit"
                disabled={isSubmitting || otp.join("").length < 6}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
};

export default LoginModal;
