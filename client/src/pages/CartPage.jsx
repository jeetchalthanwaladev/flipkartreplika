import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiShoppingCart, FiChevronDown, FiShield, FiTag } from "react-icons/fi";
import { useShop } from "../context/useShop";
import { products } from "../data/products";
import "../styles/pages.css";

const CartPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("flipkart");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart, saveForLater, user, address, saveAddress } = useShop();
  const pendingBuyNow = useRef(false);

  // Address modal form state
  const [formData, setFormData] = useState(
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

  useEffect(() => {
    if (user && pendingBuyNow.current) {
      pendingBuyNow.current = false;
      navigate("/checkout");
    }
  }, [navigate, user]);

  const mrpTotal = cart.reduce((acc, item) => acc + (item.mrp || item.price * 2) * item.quantity, 0);
  const discountTotal = mrpTotal - cartTotal;
  const platformFee = 10;
  const grandTotal = cartTotal + platformFee;

  const buyNow = () => {
    if (!user) {
      pendingBuyNow.current = true;
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressText || !formData.pincode) {
      alert("Please fill in all required address fields.");
      return;
    }
    saveAddress(formData);
    setShowAddressModal(false);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="cart-page-shell">
        {cart.length === 0 ? (
          <>
            <div className="cart-empty-tabs">
              <button className="active" type="button">Flipkart</button>
              <button type="button">Grocery</button>
            </div>
            <section className={!user ? "cart-empty-logged-out" : "cart-empty-member"}>
              <FiShoppingCart className="empty-cart-icon" aria-hidden="true" />
              <h2>{user ? "Your cart is empty!" : "Missing Cart items?"}</h2>
              {!user && <button className="empty-cart-login" type="button" onClick={() => navigate("/login")}>Login</button>}
              <button className={user ? "empty-cart-shop" : "continue-shopping-link"} type="button" onClick={() => navigate("/")}>{user ? "Shop now" : "Continue Shopping"}</button>
            </section>
            <section className="missed-products-section">
              <h3>Items you may have missed</h3>
              <div className="missed-products-row">
                {products.map((product) => (
                  <article className="missed-product-card" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <p>{product.name}</p>
                    <strong>₹{product.price.toLocaleString()}</strong>
                    <button type="button" onClick={() => navigate("/")}>View product</button>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-column">
              {/* Flipkart / Grocery Tabs */}
              <div className="cart-tabs-bar">
                <button
                  type="button"
                  className={`cart-tab ${activeTab === "flipkart" ? "active" : ""}`}
                  onClick={() => setActiveTab("flipkart")}
                >
                  Flipkart ({cart.length})
                </button>
                <button
                  type="button"
                  className={`cart-tab ${activeTab === "grocery" ? "active" : ""}`}
                  onClick={() => setActiveTab("grocery")}
                >
                  Grocery
                </button>
              </div>

              {/* Saved Address Bar */}
              <div className="saved-address-bar">
                <div className="address-info-text">
                  <span>
                    Deliver to: <strong>{address ? `${address.name}, ${address.pincode}` : "Select Delivery Address"}</strong>{" "}
                    {address?.type && <span className="address-type-badge">{address.type}</span>}
                  </span>
                  <p className="address-subtext">
                    {address
                      ? `${address.addressText}, ${address.city} - ${address.pincode}`
                      : "Please add your delivery address to proceed"}
                  </p>
                </div>
                <button
                  type="button"
                  className="address-change-btn"
                  onClick={() => {
                    setFormData(address || { name: "", phone: "", pincode: "", locality: "", addressText: "", city: "", state: "", type: "HOME" });
                    setShowAddressModal(true);
                  }}
                >
                  {address ? "Change" : "Add Address"}
                </button>
              </div>

              {/* Cart Items List */}
              {cart.map((item) => {
                const itemMrp = item.mrp || item.price * 2;
                const itemDiscount = Math.round(((itemMrp - item.price) / itemMrp) * 100);

                return (
                  <article className="cart-page-item" key={item.id}>
                    <div className="cart-item-image-col">
                      <img src={item.image} alt={item.name} />
                      <div className="qty-selector-container">
                        <span>Qty: {item.quantity}</span>
                        <div className="qty-btn-group">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                    </div>

                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.name}</h3>
                      <p className="cart-item-meta">Size: 32</p>

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

                      <p className="delivery-date-est">Delivery by Sep 29, Tue</p>
                    </div>

                    <div className="cart-item-actions">
                      <button type="button" onClick={() => saveForLater(item.id)}>SAVE FOR LATER</button>
                      <button type="button" onClick={() => removeFromCart(item.id)}>REMOVE</button>
                      <button type="button" onClick={buyNow}>BUY THIS NOW</button>
                    </div>
                  </article>
                );
              })}

              {/* Big Billion Days Banner */}
              <div className="bbd-banner">
                <div className="bbd-content">
                  <div className="bbd-crown-icon">👑</div>
                  <div>
                    <strong>10% Savings* during the Big Billion Days</strong>
                    <p>ZERO joining fee</p>
                  </div>
                </div>
                <button type="button" className="bbd-action-btn">Apply to unlock &gt;</button>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="cart-sticky-bottom-bar">
                <div className="sticky-price-info">
                  <span className="old-price">₹{mrpTotal.toLocaleString()}</span>
                  <strong className="current-price">₹{grandTotal.toLocaleString()}</strong>
                </div>
                <button className="place-order-yellow-btn" type="button" onClick={buyNow}>
                  Place Order
                </button>
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

              <div className="security-note">
                <FiShield className="shield-icon" />
                <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Address Edit/Add Modal */}
      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal-content">
            <h3>{address ? "Edit Delivery Address" : "Add Delivery Address"}</h3>
            <form onSubmit={handleSaveAddress} className="address-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="10-digit mobile number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Locality *"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  required
                />
              </div>

              <textarea
                placeholder="Address (Area and Street) *"
                value={formData.addressText}
                onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                required
                rows={3}
              />

              <div className="form-row">
                <input
                  type="text"
                  placeholder="City/District/Town *"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>

              <div className="address-type-selector">
                <label>Address Type:</label>
                <button
                  type="button"
                  className={`type-btn ${formData.type === "HOME" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, type: "HOME" })}
                >
                  HOME
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.type === "WORK" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, type: "WORK" })}
                >
                  WORK
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddressModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  SAVE AND DELIVER HERE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CartPage;
