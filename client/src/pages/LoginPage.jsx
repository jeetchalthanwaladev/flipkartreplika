import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/useShop";
import "../styles/loginpage.css";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please enter a valid phone number or email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(phone);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
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
                {/* Sun & Cloud */}
                <circle cx="150" cy="30" r="10" fill="#FFE500" />
                <path d="M140 38C140 35 143 32 147 32C148 28 152 26 156 27C159 26 163 28 164 32C167 32 170 35 170 38C170 41 167 43 164 43H140C137 43 140 38 140 38Z" fill="#589BFF" opacity="0.8" />
                
                {/* Laptop Base */}
                <rect x="50" y="70" width="100" height="60" rx="4" fill="#FFFFFF" />
                <rect x="55" y="75" width="90" height="50" rx="2" fill="#E8F1FF" />
                <circle cx="100" cy="95" r="12" fill="#B2D0FF" />
                <path d="M92 115C92 108 95 105 100 105C105 105 108 108 108 115H92Z" fill="#B2D0FF" />
                
                {/* Laptop Keyboard base */}
                <path d="M40 130H160L165 135H35L40 130Z" fill="#E0E0E0" />
                
                {/* Decorative boxes */}
                <rect x="25" y="105" width="25" height="25" fill="#E53935" rx="2" />
                <path d="M37 112L42 117L37 122" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                
                <rect x="150" y="105" width="30" height="25" fill="#FFC107" rx="2" />
                <path d="M165 110V125" stroke="#2874F0" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Right Column */}
          <div className="login-card-right">
            <h2 className="login-heading">Log in for the best experience</h2>
            <p className="login-subheading">
              {isEmailMode ? "Enter your email to continue" : "Enter your phone number to continue"}
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label className="input-label">
                  {isEmailMode ? "Email-ID" : "Phone Number"}
                </label>
                <div className="input-field-container">
                  {!isEmailMode && (
                    <span className="country-code">
                      +91 <span>▼</span>
                    </span>
                  )}
                  <input
                    type={isEmailMode ? "email" : "text"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=""
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
                    setIsEmailMode(!isEmailMode);
                    setError("");
                  }}
                >
                  {isEmailMode ? "Use Phone Number" : "Use Email-ID"}
                </button>
              </div>

              <p className="terms-text">
                By continuing, you confirm that you are above 18 years of age, and you agree to the Flipkart's{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Terms of Use</a> and{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </p>

              <button
                type="submit"
                className={`login-submit-btn ${phone.trim() ? "active" : ""}`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
