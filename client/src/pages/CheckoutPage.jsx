import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCheck, FiChevronDown, FiTag } from "react-icons/fi";
import { useShop } from "../context/useShop";
import "../styles/pages.css";

const CheckoutPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [donation, setDonation] = useState(0);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const navigate = useNavigate();
  const { cart, cartTotal, user, address, saveAddress } = useShop();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [addressForm, setAddressForm] = useState(
    address || {
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      addressText: "",
      city: "",
      state: "",
      type: "HOME",
    }
  );

  const mrpTotal = cart.reduce((acc, item) => acc + (item.mrp || item.price * 2) * item.quantity, 0);
  const discountTotal = mrpTotal - cartTotal;
  const platformFee = 10;
  const grandTotal = cartTotal + platformFee + donation;

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.addressText || !addressForm.pincode) {
      alert("Please fill in all required address fields.");
      return;
    }
    saveAddress(addressForm);
    setIsEditingAddress(false);
  };

  const handleContinue = () => {
    if (!address) {
      alert("Please add and save a delivery address first.");
      return;
    }
    navigate("/payment", { state: { donation, grandTotal, mrpTotal, discountTotal } });
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="cart-page-shell">
        {/* Stepper Bar */}
        <div className="checkout-stepper-header">
          <div className={`stepper-step ${address ? "completed" : "active"}`}>
            <span className="step-num">{address ? <FiCheck /> : "1"}</span>
            <span className="step-label">Address</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-step active">
            <span className="step-num">2</span>
            <span className="step-label">Order Summary</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-step pending">
            <span className="step-num">3</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {cart.length === 0 ? (
          <section className="page-panel empty-state">
            <h2>Your cart is empty</h2>
            <button className="primary-action" type="button" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="checkout-left-column">
              {/* Delivery Address Block */}
              <div className="checkout-panel address-block">
                <div className="address-header-row">
                  <span className="section-label">Deliver to:</span>
                  {address && !isEditingAddress && (
                    <button
                      type="button"
                      className="address-change-btn"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      Change
                    </button>
                  )}
                </div>

                {address && !isEditingAddress ? (
                  <div className="saved-address-details">
                    <div className="address-name-line">
                      <strong>{address.name}</strong>
                      <span className="address-type-pill">{address.type || "HOME"}</span>
                    </div>
                    <p className="address-text">
                      {address.addressText}, {address.locality ? `${address.locality}, ` : ""}{address.city} - {address.pincode}
                    </p>
                    <p className="address-phone">{address.phone}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveAddress} className="address-edit-form">
                    <h4 className="form-title">
                      {address ? "Edit Delivery Address" : "Add New Delivery Address"}
                    </h4>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="10-digit mobile number *"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Pincode *"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Locality *"
                        value={addressForm.locality}
                        onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Address (Area and Street) *"
                      value={addressForm.addressText}
                      onChange={(e) => setAddressForm({ ...addressForm, addressText: e.target.value })}
                      required
                      rows={3}
                    />
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="City/District/Town *"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                    </div>

                    <div className="address-type-selector">
                      <label>Address Type:</label>
                      <button
                        type="button"
                        className={`type-btn ${addressForm.type === "HOME" ? "active" : ""}`}
                        onClick={() => setAddressForm({ ...addressForm, type: "HOME" })}
                      >
                        HOME
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${addressForm.type === "WORK" ? "active" : ""}`}
                        onClick={() => setAddressForm({ ...addressForm, type: "WORK" })}
                      >
                        WORK
                      </button>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-deliver-btn">
                        SAVE AND DELIVER HERE
                      </button>
                      {address && (
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => setIsEditingAddress(false)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Order Summary Block */}
              <div className="checkout-panel order-summary-block">
                {cart.map((item) => {
                  const itemMrp = item.mrp || item.price * 2;
                  const itemDiscount = Math.round(((itemMrp - item.price) / itemMrp) * 100);

                  return (
                    <div className="checkout-item-card" key={item.id}>
                      <img src={item.image} alt={item.name} className="checkout-item-img" />
                      <div className="checkout-item-info">
                        <h3>{item.name}</h3>
                        <p className="size-meta">Size: 32</p>

                        <div className="rating-assured-row">
                          <span className="rating-badge">4.0 ★</span>
                          <span className="rating-count">(350)</span>
                          <span className="assured-badge font-italic">⚡Assured</span>
                        </div>

                        <div className="price-row">
                          <span className="discount-pct">↓{itemDiscount}%</span>
                          <span className="old-mrp">₹{itemMrp.toLocaleString()}</span>
                          <span className="final-price">₹{item.price.toLocaleString()}</span>
                        </div>

                        <p className="delivery-est">Delivery by Sep 29, Tue</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Donate to Flipkart Foundation */}
              <div className="checkout-panel donation-block">
                <div className="donation-header">
                  <strong>Donate to Flipkart Foundation</strong>
                  <p>Support transformative social work in India</p>
                </div>
                <div className="donation-chips">
                  {[10, 20, 50, 100].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      className={`donation-chip ${donation === amt ? "active" : ""}`}
                      onClick={() => setDonation(donation === amt ? 0 : amt)}
                    >
                      + ₹{amt}
                    </button>
                  ))}
                </div>
                <small className="donation-note">Note: GST and No cost EMI will not be applicable</small>
              </div>
            </section>

            {/* Price Details Right Column */}
            <aside className="cart-summary page-panel">
              <h2 className="price-details-heading">Price Details</h2>
              <div className="summary-row">
                <span>MRP (incl. of all taxes)</span>
                <strong>₹{mrpTotal.toLocaleString()}</strong>
              </div>
              <div className="summary-row">
                <span>Fees <FiChevronDown className="inline-icon" /></span>
                <strong>₹{platformFee}</strong>
              </div>
              {donation > 0 && (
                <div className="summary-row">
                  <span>Donation</span>
                  <strong>₹{donation}</strong>
                </div>
              )}
              <div className="summary-row green-text">
                <span>Discounts <FiChevronDown className="inline-icon" /></span>
                <strong>-₹{discountTotal.toLocaleString()}</strong>
              </div>

              <div className="summary-row summary-total">
                <span>Total Amount</span>
                <strong>₹{grandTotal.toLocaleString()}</strong>
              </div>

              <div className="savings-badge-box">
                <FiTag className="savings-tag-icon" />
                <span>You'll save ₹{discountTotal.toLocaleString()} on this order!</span>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                className={`continue-yellow-btn ${!address ? "disabled" : ""}`}
                disabled={!address || isEditingAddress}
                onClick={handleContinue}
              >
                Continue
              </button>

              {!address && (
                <p className="address-required-warning">
                  ⚠️ Please add and save your delivery address to enable Continue.
                </p>
              )}
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
