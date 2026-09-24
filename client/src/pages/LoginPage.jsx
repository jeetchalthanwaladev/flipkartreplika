import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/useShop";
import "../styles/loginpage.css";

const LoginPage = () => {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [demoOtp, setDemoOtp] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { requestOtp, verifyOtp } = useShop();
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  // Timer countdown for OTP resend
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

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal && value !== "") return;

    const newOtp = [...otp];

    // If pasted full string
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

    // Auto advance focus to next box
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
    setLoading(true);
    try {
      await verifyOtp(phone.replace(/\D/g, ""), fullOtp);
      navigate("/");
    } catch (err) {
      setError(err.message || "Incorrect OTP. Please enter valid OTP or click Resend.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="login-page-wrapper">
      <Navbar searchTerm="" onSearchChange={() => {}} />

      <main className="login-page-container">
        <div className="login-card">
          {/* Left Column */}
          <div className="login-card-left">
            <div>
              <h1 className="login-title">Login</h1>
              <p className="login-subtitle">
                Login to access your orders, exclusive offers, rewards and recommendations
              </p>
            </div>

            <div className="login-illustration">
              <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="illustration-svg">
                <circle cx="150" cy="30" r="10" fill="#FFE500" />
                <path d="M140 38C140 35 143 32 147 32C148 28 152 26 156 27C159 26 163 28 164 32C167 32 170 35 170 38C170 41 167 43 164 43H140C137 43 140 38 140 38Z" fill="#589BFF" opacity="0.8" />
                <rect x="50" y="70" width="100" height="60" rx="4" fill="#FFFFFF" />
                <rect x="55" y="75" width="90" height="50" rx="2" fill="#E8F1FF" />
                <circle cx="100" cy="95" r="12" fill="#B2D0FF" />
                <path d="M92 115C92 108 95 105 100 105C105 105 108 108 108 115H92Z" fill="#B2D0FF" />
                <path d="M40 130H160L165 135H35L40 130Z" fill="#E0E0E0" />
                <rect x="25" y="105" width="25" height="25" fill="#E53935" rx="2" />
                <path d="M37 112L42 117L37 122" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <rect x="150" y="105" width="30" height="25" fill="#FFC107" rx="2" />
                <path d="M165 110V125" stroke="#2874F0" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Right Column */}
          <div className="login-card-right">
            {step === "phone" ? (
              <>
                <h2 className="login-heading">Log in for the best experience</h2>
                <p className="login-subheading">
                  {isSignup ? "Create your account using your phone number" : "Enter your phone number to continue"}
                </p>

                <form onSubmit={handleSendOtp} className="login-form">
                  <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <div className="input-field-container">
                      <span className="country-code">
                        +91 <span>▼</span>
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter Mobile Number"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && <div className="login-error-message">{error}</div>}

                  <div className="toggle-mode-wrapper">
                    <button
                      type="button"
                      className="toggle-mode-btn"
                      onClick={() => {
                        setIsSignup(!isSignup);
                        setPhone("");
                        setError("");
                      }}
                    >
                      {isSignup ? "Already have an account? Login" : "New to Flipkart? Sign Up"}
                    </button>
                  </div>

                  <p className="terms-text">
                    By continuing, you confirm that you are above 18 years of age, and you agree to Flipkart's{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>Terms of Use</a> and{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                  </p>

                  <button
                    type="submit"
                    className={`login-submit-btn ${phone.trim().length >= 10 ? "active" : ""}`}
                    disabled={loading || phone.trim().length < 10}
                  >
                    {loading ? "Sending OTP..." : "Continue"}
                  </button>
                </form>
              </>
            ) : (
              <div className="otp-verification-container">
                <p className="otp-instruction">
                  Please enter the verification code we've sent you on{" "}
                  <strong className="otp-phone-text">+91-{phone}</strong>{" "}
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

                {demoOtp && (
                  <div className="demo-otp-banner">
                    <span>💬 SMS Code Sent! Your OTP is: <strong>{demoOtp}</strong></span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="login-form">
                  <div className="otp-input-section">
                    <div className="otp-boxes-wrapper">
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
                      <div className="otp-timer-col">
                        {!canResend ? (
                          <span className="otp-timer">{formatTimer(timer)}</span>
                        ) : (
                          <button
                            type="button"
                            className="otp-resend-btn"
                            onClick={handleSendOtp}
                            disabled={loading}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && <div className="login-error-message">{error}</div>}

                  <button
                    type="submit"
                    className={`login-submit-btn verify-btn ${otp.join("").length === 6 ? "active" : ""}`}
                    disabled={loading || otp.join("").length < 6}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
