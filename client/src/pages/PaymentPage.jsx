import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  FiArrowLeft,
  FiLock,
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiSmartphone,
  FiX,
} from "react-icons/fi";
import { useShop } from "../context/useShop";
import { apiRequest } from "../services/api";
import "../styles/pages.css";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("recommended");
  const [showQrCode, setShowQrCode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCodModal, setShowCodModal] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode] = useState("7482");

  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart, cartTotal, clearCart } = useShop();

  const mrpTotal = state?.mrpTotal || (cart.length > 0 ? cart.reduce((acc, item) => acc + (item.mrp || item.price * 2) * item.quantity, 0) : 699);
  const sellingPrice = cartTotal || 383;
  const discountTotal = state?.discountTotal || (mrpTotal - sellingPrice);
  const handlingFee = 7;
  const platformFee = 10;
  const totalFees = handlingFee + platformFee;
  const grandTotal = state?.grandTotal || (sellingPrice + totalFees);

  const handlePlaceOrderClick = () => {
    setShowCodModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      if (cart.length > 0) {
        await apiRequest("/orders", {
          method: "POST",
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.id,
              productName: item.name,
              image: item.image,
              unitPrice: item.price,
              quantity: item.quantity,
            })),
          }),
        });
      }
      clearCart();
      setTimeout(() => {
        setIsProcessing(false);
        setShowCodModal(false);
        navigate("/orderresponse?reference_id=OD4387012595109061");
      }, 600);
    } catch {
      clearCart();
      setIsProcessing(false);
      setShowCodModal(false);
      navigate("/orderresponse?reference_id=OD4387012595109061");
    }
  };

  return (
    <>
      <header className="payment-brand-header">
        <button type="button" onClick={() => navigate("/")} aria-label="Go to Flipkart home">
          <span>F</span> Flipkart
        </button>
      </header>
      <main className="payment-page-shell">
        {/* Subheader */}
        <div className="payment-subheader">
          <button type="button" className="back-btn" onClick={() => navigate("/checkout")}>
            <FiArrowLeft /> Complete Payment
          </button>
          <span className="secure-badge">
            <FiLock /> 100% Secure
          </span>
        </div>

        <div className="payment-grid-layout">
          {/* Left Column: Payment Options Sidebar */}
          <section className="payment-options-panel">
            <div
              className={`payment-option-tab ${selectedMethod === "recommended" ? "active" : ""}`}
              onClick={() => setSelectedMethod("recommended")}
            >
              <div className="option-icon-box"><FiGift /></div>
              <div className="option-text">
                <strong>Recommended for You</strong>
              </div>
            </div>

            <div
              className={`payment-option-tab ${selectedMethod === "upi" ? "active" : ""}`}
              onClick={() => setSelectedMethod("upi")}
            >
              <div className="option-icon-box"><FiSmartphone /></div>
              <div className="option-text font-italic">
                <strong>UPI</strong>
                <small>Pay by any UPI app</small>
              </div>
            </div>

            <div
              className={`payment-option-tab ${selectedMethod === "card" ? "active" : ""}`}
              onClick={() => setSelectedMethod("card")}
            >
              <div className="option-icon-box"><FiCreditCard /></div>
              <div className="option-text">
                <strong>Credit / Debit / ATM Card</strong>
                <small>Add and secure cards as per RBI guidelines</small>
                <span className="offer-tag">Get upto 5% cashback • 2 offers available</span>
              </div>
            </div>

            <div
              className={`payment-option-tab ${selectedMethod === "cod" ? "active" : ""}`}
              onClick={() => setSelectedMethod("cod")}
            >
              <div className="option-icon-box"><FiDollarSign /></div>
              <div className="option-text">
                <strong>Cash on Delivery</strong>
              </div>
            </div>

            <div
              className={`payment-option-tab ${selectedMethod === "gift" ? "active" : ""}`}
              onClick={() => setSelectedMethod("gift")}
            >
              <div className="option-icon-box"><FiGift /></div>
              <div className="option-text">
                <strong>Have a Flipkart Gift Card?</strong>
              </div>
            </div>

            <div className="payment-option-tab disabled">
              <div className="option-icon-box"><FiCreditCard /></div>
              <div className="option-text">
                <strong>EMI</strong>
                <span className="unavailable-badge">Unavailable ℹ</span>
              </div>
            </div>
          </section>

          {/* Middle Column: Selected Payment Option details */}
          <section className="payment-details-panel">
            {selectedMethod === "recommended" && (
              <div className="recommended-box">
                <p className="handling-fee-notice">
                  Due to handling costs, a nominal fee of ₹7 will be charged for orders placed using this option. Avoid this fee by paying online now.
                </p>
                <button
                  type="button"
                  className="yellow-place-order-btn"
                  onClick={handlePlaceOrderClick}
                >
                  Place Order
                </button>
              </div>
            )}

            {selectedMethod === "upi" && (
              <div className="upi-qr-card">
                <h2 className="qr-title">Scan QR and Pay</h2>

                <div className="qr-amount-row">
                  <span>AMOUNT</span>
                  <strong>₹{grandTotal.toLocaleString()}</strong>
                </div>

                <div className="qr-code-box">
                  {showQrCode ? (
                    <div className="qr-image-wrapper">
                      <svg viewBox="0 0 100 100" className="qr-code-svg">
                        <rect width="100" height="100" fill="#ffffff" />
                        <path d="M10 10h30v30h-30zM15 15v20h20v-20zM20 20h10v10h-10z" fill="#000" />
                        <path d="M60 10h30v30h-30zM65 15v20h20v-20zM70 20h10v10h-10z" fill="#000" />
                        <path d="M10 60h30v30h-30zM15 65v20h20v-20zM20 70h10v10h-10z" fill="#000" />
                        <path d="M45 10h10v10h-10zM45 30h10v20h-10zM50 60h20v10h-20zM70 50h20v40h-20zM40 70h10v20h-10z" fill="#000" />
                      </svg>
                    </div>
                  ) : (
                    <button type="button" className="show-qr-btn" onClick={() => setShowQrCode(true)}>
                      Show QR code
                    </button>
                  )}
                </div>

                <div className="upi-apps-row">
                  <span className="upi-app-badge gpay">GPay</span>
                  <span className="upi-app-badge phonepe">PhonePe</span>
                  <span className="upi-app-badge paytm">Paytm</span>
                  <span className="upi-app-badge bhim">BHIM</span>
                  <span className="other-upi-text">or any other UPI app</span>
                </div>

                <p className="disclaimer-text">
                  Do not hit back or close this screen until the transaction is complete
                </p>

                <button
                  type="button"
                  className="pay-now-btn"
                  disabled={isProcessing}
                  onClick={handlePlaceOrderClick}
                >
                  {isProcessing ? "Processing..." : `PAY ₹${grandTotal.toLocaleString()}`}
                </button>
              </div>
            )}

            {selectedMethod === "card" && (
              <div className="card-input-box">
                <h2>Enter Card Details</h2>
                <input type="text" placeholder="Card Number" className="card-input" maxLength={16} />
                <div className="card-row">
                  <input type="text" placeholder="MM/YY" className="card-input" maxLength={5} />
                  <input type="password" placeholder="CVV" className="card-input" maxLength={4} />
                </div>
                <button
                  type="button"
                  className="pay-now-btn"
                  disabled={isProcessing}
                  onClick={handlePlaceOrderClick}
                >
                  {isProcessing ? "Processing..." : `PAY ₹${grandTotal.toLocaleString()}`}
                </button>
              </div>
            )}

            {selectedMethod === "cod" && (
              <div className="cod-box">
                <h2>Cash on Delivery</h2>
                <p>Pay via UPI or Cash when you receive your order.</p>
                <button
                  type="button"
                  className="yellow-place-order-btn"
                  onClick={handlePlaceOrderClick}
                >
                  Place Order
                </button>
              </div>
            )}

            {selectedMethod === "gift" && (
              <div className="gift-card-box">
                <h2>Flipkart Gift Card</h2>
                <input type="text" placeholder="Voucher Number" className="card-input" />
                <input type="password" placeholder="Voucher PIN" className="card-input" />
                <button
                  type="button"
                  className="pay-now-btn"
                  disabled={isProcessing}
                  onClick={handlePlaceOrderClick}
                >
                  APPLY &amp; PAY ₹{grandTotal.toLocaleString()}
                </button>
              </div>
            )}
          </section>

          {/* Right Column: Price Details Panel */}
          <aside className="payment-summary-panel page-panel">
            <h2 className="price-details-heading">Price Details</h2>
            <div className="summary-row">
              <span>MRP (incl. of all taxes)</span>
              <strong>₹{mrpTotal.toLocaleString()}</strong>
            </div>
            <div className="summary-row fees-breakdown-row">
              <span>Fees <FiChevronDown className="inline-icon" /></span>
            </div>
            <div className="fees-sub-rows">
              <div className="sub-fee-row">
                <span>Payment Handling Fee</span>
                <strong>₹{handlingFee}</strong>
              </div>
              <div className="sub-fee-row">
                <span>Platform Fee</span>
                <strong>₹{platformFee}</strong>
              </div>
            </div>

            <div className="summary-row green-text">
              <span>Discounts <FiChevronDown className="inline-icon" /></span>
            </div>
            <div className="fees-sub-rows green-text">
              <div className="sub-fee-row">
                <span>MRP Discount</span>
                <strong>-₹{discountTotal.toLocaleString()}</strong>
              </div>
            </div>

            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <strong>₹{grandTotal.toLocaleString()}</strong>
            </div>

            <div className="cashback-banner">
              <span className="cashback-title">5% Cashback</span>
              <p>Claim now with payment offers</p>
            </div>
          </aside>
        </div>
      </main>

      {/* Confirm Cash on Delivery Order Modal */}
      {showCodModal && (
        <div className="cod-modal-overlay">
          <div className="cod-modal-card">
            <button
              type="button"
              className="cod-modal-close"
              onClick={() => setShowCodModal(false)}
              aria-label="Close"
            >
              <FiX />
            </button>

            <h3 className="cod-modal-title">Confirm Cash on Delivery Order</h3>
            <p className="cod-modal-subtext">Pay via UPI or Cash when you receive your order</p>

            <div className="cod-illustration-wrapper">
              <svg viewBox="0 0 240 140" className="cod-delivery-svg">
                <rect x="0" y="0" width="240" height="140" fill="#ffffff" />
                {/* Door / Frame */}
                <rect x="170" y="30" width="45" height="100" fill="#f0f5ff" stroke="#2874f0" strokeWidth="2" />
                <circle cx="178" cy="80" r="3" fill="#2874f0" />
                
                {/* Delivery Agent (Blue Person) */}
                <circle cx="95" cy="50" r="10" fill="#333333" />
                <path d="M85 70C85 60 90 58 95 58C100 58 105 60 105 70V110H85V70Z" fill="#2874f0" />
                <line x1="90" y1="110" x2="90" y2="135" stroke="#333" strokeWidth="4" />
                <line x1="100" y1="110" x2="100" y2="135" stroke="#333" strokeWidth="4" />
                
                {/* Yellow Box Package */}
                <rect x="105" y="70" width="25" height="20" fill="#ffe500" stroke="#f7c900" strokeWidth="1.5" />
                <line x1="117.5" y1="70" x2="117.5" y2="90" stroke="#333" strokeWidth="1.5" />
                
                {/* Customer (Purple/Pink Person inside door) */}
                <circle cx="150" cy="52" r="9" fill="#333333" />
                <path d="M142 70C142 62 146 60 150 60C154 60 158 62 158 70V110H142V70Z" fill="#7b1fa2" />
                
                {/* Plant */}
                <path d="M225 120 L220 135 L230 135 Z" fill="#795548" />
                <circle cx="225" cy="115" r="7" fill="#4caf50" />
              </svg>
            </div>

            <div className="cod-modal-footer">
              <button
                type="button"
                className="cod-cancel-btn"
                onClick={() => setShowCodModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cod-confirm-btn"
                disabled={isProcessing}
                onClick={handleConfirmOrder}
              >
                {isProcessing ? "Confirming..." : "Confirm order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PaymentPage;