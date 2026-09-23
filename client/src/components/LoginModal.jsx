import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useShop } from "../context/useShop";
import "../styles/loginmodal.css";

const LoginModal = () => {
  const { loginOpen, closeLogin, login } = useShop();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loginOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(phone);
      setPhone("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-overlay" role="presentation" onMouseDown={closeLogin}>
      <aside className="login-drawer" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="login-close" type="button" onClick={closeLogin} aria-label="Close login">
          <FiX />
        </button>
        <div className="login-drawer-copy">
          <h2 id="login-title">Login to complete your shopping</h2>
          <p>Get access to your cart, orders and faster checkout.</p>
        </div>
        <form onSubmit={handleSubmit}>
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
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default LoginModal;
