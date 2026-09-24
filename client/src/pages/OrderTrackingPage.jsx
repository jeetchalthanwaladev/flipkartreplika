import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import {
  FiChevronUp,
  FiChevronDown,
  FiMessageSquare,
  FiChevronRight,
  FiHome,
  FiUser,
  FiCopy,
  FiX,
  FiShare2,
  FiAward,
} from "react-icons/fi";
import { useShop } from "../context/useShop";
import { apiRequest } from "../services/api";
import "../styles/ordertrackingpage.css";

const OrderTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeliveryDetailsOpen, setIsDeliveryDetailsOpen] = useState(true);
  const [isPriceDetailsOpen, setIsPriceDetailsOpen] = useState(true);
  const [isOffersOpen, setIsOffersOpen] = useState(false);

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryOrderId =
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("item_id") ||
    searchParams.get("id");
  const isQueryCancelled = searchParams.get("cancelled") === "true";

  const orderId = paramId || queryOrderId || "OD438701259510906100";

  const navigate = useNavigate();
  const { user, address } = useShop();

  const loadOrder = useCallback(() => {
    const storedCancelled = JSON.parse(localStorage.getItem("flipkart_cancelled_orders") || "[]");
    const isCancelledSaved = storedCancelled.includes(orderId) || isQueryCancelled;

    apiRequest(`/orders/${orderId}`)
      .then((data) => {
        if (data && data.order) {
          const ord = data.order;
          if (isCancelledSaved) ord.status = "cancelled";
          setOrder(ord);
        }
      })
      .catch(() => {
        // Fallback mock order matching user screenshots
        setOrder({
          id: orderId,
          status: isCancelledSaved ? "cancelled" : "confirmed",
          created_at: new Date().toISOString(),
          total_amount: 142,
          items: [
            {
              id: 1,
              product_name: "RUNICHA Back Cover for MOTOROLA G85 5G",
              image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400",
              unit_price: 125,
              quantity: 1,
              size: "Transparent",
              color: "Transparent",
              seller: "V-Create",
            },
          ],
        });
      });
  }, [orderId, isQueryCancelled]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      loadOrder();
    }
  }, [user, navigate, loadOrder]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const item = order?.items?.[0] || {
    product_name: "RUNICHA Back Cover for MOTOROLA G85 5G",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400",
    unit_price: 125,
    size: "Transparent",
    color: "Transparent",
    seller: "V-Create",
  };

  const isCancelled = order?.status === "cancelled";
  const listingPrice = 699;
  const sellingPrice = Number(item.unit_price || 125);
  const totalFees = 17;
  const totalAmount = Number(order?.total_amount || 142);
  const savedAmount = listingPrice - sellingPrice;

  return (
    <div className="order-details-page">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryBar />

      <main className="order-details-container">
        {/* Breadcrumb matching Screenshot 1 */}
        <div className="breadcrumb-bar">
          <span onClick={() => navigate("/")}>Home</span> &gt;{" "}
          <span onClick={() => navigate("/account")}>My Account</span> &gt;{" "}
          <span onClick={() => navigate("/orders")}>My Orders</span> &gt;{" "}
          <span className="active">{orderId}</span>
        </div>

        {order && (
          <div className="order-details-grid">
            {/* Left Column */}
            <section className="order-details-left">
              {/* Pay Online Top Banner (Screenshot 1) */}
              {!isCancelled && (
                <div className="pay-online-card">
                  <div className="pay-online-text">
                    Pay online for a smooth doorstep experience
                  </div>
                  <button
                    type="button"
                    className="pay-amount-btn"
                    onClick={() => navigate(`/payment?order_id=${orderId}`)}
                  >
                    Pay ₹{totalAmount}
                  </button>
                </div>
              )}

              {/* Product Info & Status Stepper Card */}
              <div className="tracking-card">
                <div className="tracking-card-header">
                  <div className="product-text-info">
                    <h1 className="product-title">{item.product_name}</h1>
                    <p className="product-variant">{item.color || item.size || "Transparent"}</p>
                    <p className="seller-name">Seller: {item.seller || "V-Create"}</p>
                    <div className="price-offers-row">
                      <span className="main-price">₹{totalAmount}</span>
                      <span className="offers-badge">4 offers</span>
                    </div>
                  </div>
                  <div className="product-thumb-box">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400";
                      }}
                    />
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="status-timeline">
                  {isCancelled ? (
                    <>
                      {/* Cancelled flow: Step 1 Confirmed, Step 2 Cancelled */}
                      <div className="timeline-step confirmed active">
                        <div className="step-indicator">
                          <span className="step-dot filled-green">✓</span>
                          <div className="step-line gray-line" />
                        </div>
                        <div className="step-content">
                          <span className="step-title">Order Confirmed, Wed Sep 23</span>
                        </div>
                      </div>

                      <div className="timeline-step cancelled active">
                        <div className="step-indicator">
                          <span className="step-dot filled-red">✓</span>
                        </div>
                        <div className="step-content">
                          <span className="step-title">Cancelled, Today, Sep 24</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Step 1: Confirmed */}
                      <div className="timeline-step confirmed active">
                        <div className="step-indicator">
                          <span className="step-dot filled-green">✓</span>
                          <div className="step-line green-line" />
                        </div>
                        <div className="step-content">
                          <strong className="step-title">Order Confirmed</strong>
                          <div className="seller-processed-badge">
                            Seller has processed your order., Wed 23rd Sep
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Shipped */}
                      <div className="timeline-step upcoming">
                        <div className="step-indicator">
                          <span className="step-dot hollow-gray" />
                          <div className="step-line gray-line" />
                        </div>
                        <div className="step-content">
                          <span className="step-title">Shipped, Expected By Sep 25</span>
                        </div>
                      </div>

                      {/* Step 3: Out For Delivery */}
                      <div className="timeline-step upcoming">
                        <div className="step-indicator">
                          <span className="step-dot hollow-gray" />
                          <div className="step-line gray-line" />
                        </div>
                        <div className="step-content">
                          <span className="step-title">Out For Delivery</span>
                        </div>
                      </div>

                      {/* Step 4: Delivery */}
                      <div className="timeline-step upcoming">
                        <div className="step-indicator">
                          <span className="step-dot hollow-gray" />
                        </div>
                        <div className="step-content delivery-step-content">
                          <span className="step-title">Delivery, Mon Sep 28 By 11 PM</span>
                          <button
                            type="button"
                            className="change-date-btn"
                            onClick={() => window.alert("You can select an alternate delivery slot.")}
                          >
                            Change Date
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="see-updates-row">
                    <a
                      href="#"
                      className="see-updates-link"
                      onClick={(e) => {
                        e.preventDefault();
                        window.alert("Showing detailed tracking updates.");
                      }}
                    >
                      See All Updates &gt;
                    </a>
                  </div>
                </div>

                {/* You can cancel notice banner (Screenshot 1) */}
                {!isCancelled && (
                  <div className="cancel-notice-banner">
                    <span className="cart-notice-icon">🛒</span>
                    <span className="cancel-notice-text">
                      You can cancel this order till today 3 PM
                    </span>
                  </div>
                )}
              </div>

              {/* Notice below card */}
              {isCancelled ? (
                <div className="cancelled-order-note">
                  Your order was cancelled as per your request.
                </div>
              ) : (
                <div className="delivery-exec-text">
                  Delivery Executive details will be available once the order is out for delivery
                </div>
              )}

              {/* Action Bar (Screenshot 2 vs Image 2) */}
              {isCancelled ? (
                <div className="cancelled-chat-action-card">
                  <button
                    type="button"
                    className="single-chat-btn"
                    onClick={() => window.alert("Starting live chat with Flipkart customer support.")}
                  >
                    <FiMessageSquare className="chat-btn-icon" />
                    <span>Chat with us</span>
                  </button>
                </div>
              ) : (
                <div className="action-button-bar">
                  <button
                    type="button"
                    className="action-bar-btn cancel-btn"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="action-bar-btn chat-btn"
                    onClick={() => window.alert("Starting live chat with Flipkart customer support.")}
                  >
                    <FiMessageSquare className="chat-btn-icon" />
                    <span>Chat with us</span>
                  </button>
                </div>
              )}

              {/* Rate your experience card */}
              <div className="rate-card">
                <h3 className="rate-heading">Rate your experience</h3>
                {isCancelled ? (
                  <div
                    className="rate-row-item"
                    onClick={() => window.alert("Thank you for your feedback!")}
                  >
                    <div className="rate-left">
                      <span className="rate-cart-icon">🛒</span>
                      <span>How was your cancellation experience?</span>
                    </div>
                    <FiChevronRight className="rate-arrow" />
                  </div>
                ) : (
                  <div
                    className="rate-row-item"
                    onClick={() => window.alert("Thank you for finding this helpful!")}
                  >
                    <div className="rate-left">
                      <span className="thumbs-icon">👍</span>
                      <span>Did you find this page helpful?</span>
                    </div>
                    <FiChevronRight className="rate-arrow" />
                  </div>
                )}
              </div>

              {/* Send Order Details (Only if not cancelled) */}
              {!isCancelled && (
                <div
                  className="send-order-details-card"
                  onClick={() => window.alert("Order details have been shared.")}
                >
                  <div className="send-details-left">
                    <FiShare2 className="share-icon" />
                    <span>Send Order Details</span>
                  </div>
                  <FiChevronRight className="send-arrow" />
                </div>
              )}


              {/* Order ID copy line */}
              <div className="order-id-footer">
                <span>Order #{orderId}</span>
                <button type="button" className="order-copy-btn" onClick={copyOrderId}>
                  <FiCopy /> {copied ? "Copied" : ""}
                </button>
              </div>
            </section>

            {/* Right Column */}
            <aside className="order-details-right">
              {/* Delivery Details Card (Screenshot 1) */}
              <div className="details-card">
                <div
                  className="details-card-header"
                  onClick={() => setIsDeliveryDetailsOpen(!isDeliveryDetailsOpen)}
                >
                  <h3>Delivery details</h3>
                  {isDeliveryDetailsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {isDeliveryDetailsOpen && (
                  <div className="details-card-body">
                    <div
                      className="addr-interactive-line"
                      onClick={() => navigate("/account/addresses")}
                    >
                      <FiHome className="info-icon" />
                      <div className="addr-text-wrap">
                        <strong>Home</strong>
                        <p className="addr-trunc">
                          {address?.addressText ||
                            "6/1638, 3rd flor, Siv sadan Apartment, Gundi sheri, Lal Darwaja, surat - 395003"}
                        </p>
                      </div>
                      <FiChevronRight className="addr-chevron" />
                    </div>

                    <div
                      className="addr-interactive-line"
                      onClick={() => navigate("/account")}
                    >
                      <FiUser className="info-icon" />
                      <div className="addr-text-wrap">
                        <strong>{address?.name || "Cahlthanwala Jeet"}</strong>
                        <p>{address?.phone || "6359347716"}</p>
                      </div>
                      <FiChevronRight className="addr-chevron" />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Details Card (Screenshot 1) */}
              <div className="details-card">
                <div
                  className="details-card-header"
                  onClick={() => setIsPriceDetailsOpen(!isPriceDetailsOpen)}
                >
                  <h3>Price details</h3>
                  {isPriceDetailsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {isPriceDetailsOpen && (
                  <div className="details-card-body price-body">
                    <div className="price-row">
                      <span>Listing price</span>
                      <span>₹{listingPrice}</span>
                    </div>

                    <div className="price-row">
                      <span>Selling price <span className="info-circle">ⓘ</span></span>
                      <span>₹{sellingPrice}</span>
                    </div>

                    <div className="price-row">
                      <span>Total fees <FiChevronDown className="inline-icon" /></span>
                      <span>₹{totalFees}</span>
                    </div>

                    <div className="price-row total-row">
                      <span>Total amount</span>
                      <strong>₹{totalAmount}</strong>
                    </div>

                    <div className="payment-mode-line">
                      <span>Paid By</span>
                      <span className="payment-badge-pill">
                        💵 Cash On Delivery
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Offers Earned Card (Screenshot 1) */}
              <div className="details-card">
                <div
                  className="details-card-header"
                  onClick={() => setIsOffersOpen(!isOffersOpen)}
                >
                  <div className="offers-header-left">
                    <FiAward className="trophy-icon" />
                    <h3>Offers earned</h3>
                  </div>
                  {isOffersOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {isOffersOpen && (
                  <div className="details-card-body">
                    <p className="offer-earned-text">🎉 5% cashback on Flipkart Axis Bank Card applied.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Retention Modal Popup matching Screenshot 3 */}
      {showCancelModal && (
        <div className="retention-modal-overlay">
          <div className="retention-modal-card">
            {/* Close Button X */}
            <button
              type="button"
              className="retention-close-btn"
              onClick={() => setShowCancelModal(false)}
              aria-label="Close"
            >
              <FiX />
            </button>

            {/* Cream Top Banner with Saved Badge & Product Thumbnail */}
            <div className="retention-banner">
              <div className="retention-saved-info">
                <span className="discount-badge-icon">🏷️</span>
                <strong className="saved-text">
                  You saved ₹{savedAmount} on this product!
                </strong>
              </div>
              <div className="retention-prod-img-box">
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="retention-thumb"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400";
                  }}
                />
              </div>
            </div>

            {/* Warning Question Text */}
            <div className="retention-content">
              <p className="retention-question">
                If you cancel now, you may not be able to avail this deal again. Do you still want to cancel?
              </p>
            </div>

            {/* Actions Bar */}
            <div className="retention-actions">
              <button
                type="button"
                className="retention-dont-cancel-btn"
                onClick={() => setShowCancelModal(false)}
              >
                Don&apos;t cancel
              </button>
              <button
                type="button"
                className="retention-confirm-cancel-btn"
                onClick={() => {
                  setShowCancelModal(false);
                  navigate(`/orders/cancelOrder?orderId=${orderId}`);
                }}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
