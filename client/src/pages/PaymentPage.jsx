import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useShop } from "../context/useShop";
import "../styles/pages.css";

const PaymentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { clearCart } = useShop();
  const order = state?.order;
  const total = Number(order?.total_amount || 0);

  const completePayment = () => {
    setIsPaying(true);
    window.setTimeout(() => {
      clearCart();
      navigate(`/orders/${id}`);
    }, 500);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="page-shell">
        <h1 className="page-heading">Payment</h1>
        <div className="payment-layout">
          <section className="page-panel payment-panel">
            <span className="payment-demo-badge">DEMO PAYMENT</span>
            <h2>Complete your payment</h2>
            <p>This is a dummy payment screen. No real money will be charged.</p>
            <div className="payment-method selected">
              <span className="payment-radio" />
              <div><strong>Card / UPI / Net Banking</strong><small>Secure demo checkout</small></div>
            </div>
            <button className="primary-action" type="button" disabled={isPaying} onClick={completePayment}>
              {isPaying ? "Processing Payment..." : `Pay ₹${total.toLocaleString()}`}
            </button>
          </section>
          <aside className="page-panel">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Order ID</span><strong>#{id}</strong></div>
            <div className="summary-row summary-total"><span>Total Amount</span><strong>₹{total.toLocaleString()}</strong></div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default PaymentPage;