import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useShop } from "../context/useShop";
import { apiRequest } from "../services/api";
import "../styles/pages.css";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, openLogin } = useShop();

  useEffect(() => {
    if (!user) {
      openLogin();
      return;
    }

    apiRequest("/orders")
      .then((data) => setOrders(data.orders))
      .catch((requestError) => setError(requestError.message));
  }, [user, openLogin]);

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="page-shell">
        <h1 className="page-heading">My Orders</h1>
        {error && <section className="page-panel empty-state">{error}</section>}
        {!error && user && orders.length === 0 && <section className="page-panel empty-state"><h2>No orders yet</h2><button className="primary-action" type="button" onClick={() => navigate("/")}>Start Shopping</button></section>}
        <section className="order-list">
          {orders.map((order) => (
            <Link className="order-summary-link" to={`/orders/${order.id}`} key={order.id}>
              <div><strong>Order #{order.id}</strong><p>{order.items.length} item(s) · ₹{Number(order.total_amount).toLocaleString()}</p></div>
              <span className={`status-pill ${order.status}`}>{order.status}</span>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export default OrdersPage;
