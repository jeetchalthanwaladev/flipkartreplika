import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useShop } from "../context/useShop";
import { apiRequest } from "../services/api";
import "../styles/pages.css";

const CheckoutPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeOrder, setResumeOrder] = useState(false);
  const resumeHandled = useRef(false);
  const navigate = useNavigate();
  const { cart, cartTotal, user, openLogin } = useShop();

  const placeOrder = useCallback(async () => {
    if (!user) {
      setResumeOrder(true);
      openLogin();
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const { order } = await apiRequest("/orders", {
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
      navigate(`/payment/${order.id}`, { state: { order } });
    } catch (requestError) {
      if (requestError.status === 401) openLogin();
      else setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [cart, navigate, openLogin, user]);

  useEffect(() => {
    if (user && resumeOrder && !resumeHandled.current) {
      resumeHandled.current = true;
      placeOrder();
    }
  }, [placeOrder, resumeOrder, user]);

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="page-shell">
        <h1 className="page-heading">Checkout</h1>
        {cart.length === 0 ? (
          <section className="page-panel empty-state"><h2>Your cart is empty</h2><button className="primary-action" type="button" onClick={() => navigate("/")}>Continue Shopping</button></section>
        ) : (
          <div className="page-grid">
            <section className="page-panel">
              <h2>Delivery and Payment</h2>
              <p>Confirm your order and place it securely.</p>
              {!user && <p className="checkout-note">You will be asked to log in before placing the order.</p>}
              {error && <p className="login-error">{error}</p>}
            </section>
            <aside className="page-panel">
              <h2>Order Summary</h2>
              <div className="summary-row"><span>Items</span><strong>{cart.length}</strong></div>
              <div className="summary-row summary-total"><span>Total Amount</span><strong>₹{cartTotal.toLocaleString()}</strong></div>
              <button className="primary-action" type="button" disabled={isSubmitting} onClick={placeOrder}>{isSubmitting ? "Placing Order..." : "Place Order"}</button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
};

export default CheckoutPage;
