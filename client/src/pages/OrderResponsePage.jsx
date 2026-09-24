import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import { FiCheck, FiChevronRight } from "react-icons/fi";
import { useShop } from "../context/useShop";
import "../styles/orderresponsepage.css";

const OrderResponsePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const referenceId = searchParams.get("reference_id") || "OD4387012595109061";
  const navigate = useNavigate();
  const { address } = useShop();

  return (
    <div className="order-response-page">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryBar />

      <main className="response-container">
        <div className="response-grid-layout">
          {/* Left Column */}
          <section className="response-left-col">
            {/* Thanks for shopping header */}
            <div className="thanks-card">
              <div className="thanks-text-area">
                <h1 className="thanks-title">Thanks for shopping with us!</h1>
                <p className="delivery-date-text">Delivery by Mon, Sep 28th &apos;26</p>
                <a
                  href="#"
                  className="track-order-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/orders/${referenceId}`);
                  }}
                >
                  Track &amp; manage order
                </a>
              </div>

              <div className="success-checkmark-wrapper">
                <div className="success-aura">
                  <div className="checkmark-circle">
                    <FiCheck className="checkmark-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Responsibly Banner */}
            <div className="shop-responsibly-card">
              <div className="resp-info">
                <span className="cart-icon font-emoji">🛒</span>
                <div>
                  <strong>Shop responsibly</strong>
                  <p>Free cancellations up to 24 hours</p>
                </div>
              </div>
              <FiChevronRight className="resp-arrow" />
            </div>

            {/* Delivery estimate repeat line */}
            <div className="delivery-date-bar">
              <span>Delivery by Mon, Sep 28th &apos;26</span>
            </div>

            {/* Continue Shopping Primary Action */}
            <button
              type="button"
              className="continue-shopping-blue-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>

            {/* Send Order Details link */}
            <div className="send-details-row">
              <button
                type="button"
                className="send-details-btn"
                onClick={() => window.alert("Order details link sent to your registered mobile number.")}
              >
                <span>🏷 Send Order Details</span>
                <FiChevronRight />
              </button>
            </div>

            {/* You might be also interested in */}
            <div className="interested-section">
              <h3>You might be also interested in</h3>
              <div className="interested-grid">
                <div className="rec-product-card">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" alt="Product" />
                  <span className="rec-badge">Min. 50% Off</span>
                </div>
                <div className="rec-product-card">
                  <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" alt="Product" />
                  <span className="rec-badge">Min. 50% Off</span>
                </div>
                <div className="rec-product-card">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" alt="Product" />
                  <span className="rec-badge">Min. 50% Off</span>
                </div>
                <div className="rec-product-card">
                  <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300" alt="Product" />
                  <span className="rec-badge">Min. 50% Off</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column */}
          <aside className="response-right-col">
            {/* Why call card */}
            <div className="why-call-card">
              <h3>Why call? Just click!</h3>
              <button
                type="button"
                className="go-orders-btn"
                onClick={() => navigate("/orders")}
              >
                Go to My Orders
              </button>
            </div>

            {/* Address Details card */}
            <div className="response-address-card">
              <div className="addr-header-row">
                <strong>{address?.name || "Cahlthanwala Jeet"}</strong>
                <button
                  type="button"
                  className="change-link-btn"
                  onClick={() => navigate("/account/addresses")}
                >
                  Change
                </button>
              </div>

              <p className="addr-text font-gray">
                {address?.addressText || "6/1638, 3rd flor, Siv sadan Apartment, Gundi sheri, Lal Darwaja,surat - 395003"}
              </p>
              <p className="addr-text font-gray">Siv sadan Apartment, Lal Darwaja, LalDarwaja</p>
              <p className="addr-text font-gray">{address?.city || "Surat"}</p>
              <p className="addr-text font-gray">{address?.state || "Gujarat"} - {address?.pincode || "395003"}</p>
              <p className="addr-text font-gray phone-line">Phone number: {address?.phone || "6359347716"}</p>

              <a
                href="#"
                className="change-number-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/account");
                }}
              >
                Change or Add number
              </a>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderResponsePage;
