import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useShop } from "../context/useShop";
import { apiRequest } from "../services/api";
import "../styles/pages.css";

const statuses = ["confirmed", "shipped", "delivered"];

const OrderTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLogin } = useShop();

  const loadOrder = useCallback(() => apiRequest(`/orders/${id}`).then((data) => setOrder(data.order)).catch((requestError) => setError(requestError.message)), [id]);

  useEffect(() => {
    if (!user) openLogin();
    else loadOrder();
  }, [loadOrder, openLogin, user]);

  const cancelOrder = async () => {
    try {
      const data = await apiRequest(`/orders/${id}/cancel`, { method: "PATCH" });
      setOrder((current) => ({ ...current, ...data.order }));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="page-shell">
        {error && <section className="page-panel empty-state">{error}</section>}
        {order && <>
          <h1 className="page-heading">Order #{order.id}</h1>
          <div className="page-grid">
            <section className="page-panel">
              <h2>Order Tracking</h2>
              <div className="tracking">
                {order.status === "cancelled" ? <div className="tracking-step complete">Order cancelled</div> : statuses.map((status) => <div className={`tracking-step ${statuses.indexOf(status) <= statuses.indexOf(order.status) ? "complete" : ""}`} key={status}>{status}</div>)}
              </div>
              {order.status !== "cancelled" && <button className="primary-action" type="button" onClick={cancelOrder}>Cancel Order</button>}
            </section>
            <section className="page-panel">
              <h2>Items</h2>
              <div className="order-items">{order.items.map((item) => <div className="order-item" key={item.id}><img src={item.image} alt={item.product_name} /><div><h3>{item.product_name}</h3><p>₹{Number(item.unit_price).toLocaleString()} × {item.quantity}</p></div></div>)}</div>
              <div className="summary-row summary-total"><span>Total</span><strong>₹{Number(order.total_amount).toLocaleString()}</strong></div>
              <button className="text-action" type="button" onClick={() => navigate("/orders")}>Back to Orders</button>
            </section>
          </div>
        </>}
      </main>
    </>
  );
};

export default OrderTrackingPage;
