import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiSearch, FiStar } from "react-icons/fi";
import { useShop } from "../context/useShop";
import { apiRequest } from "../services/api";
import "../styles/orderspage.css";

const defaultMockOrders = [
  {
    id: "OD438701259510906100",
    orderId: "OD438701259510906100",
    name: "RUNICHA Back Cover for MOTOROLA G85 5G",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400",
    color: "Transparent",
    price: 142,
    status: "Confirmed",
    statusText: "Expected by Mon Sep 28",
    subtext: "Seller has processed your order",
    date: "2026-09-23",
  },
  {
    id: "OD438701183601197100",
    orderId: "OD438701183601197100",
    name: "Maleno Slim Fit Men Light Green Trousers",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300",
    color: "Light Green",
    size: "32",
    price: 403,
    status: "Cancelled",
    statusText: "Cancelled on Wed Sep 23",
    subtext: "Your order was cancelled as per your request.",
    date: "2026-09-23",
  },
  {
    id: "MOCK-101",
    name: "pTron Flick M1 Wireless Ambidextrous Optical Mouse",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300",
    color: "Black",
    price: 355,
    status: "Delivered",
    statusText: "Delivered on Jan 02",
    subtext: "Your item has been delivered",
    date: "2026-01-02",
  },

  {
    id: "MOCK-102",
    name: "MAK Wireless Lapel Microphone for YouTube & Vlogging",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300",
    color: "Black",
    price: 365,
    status: "Delivered",
    statusText: "Delivered on Feb 14, 2024",
    subtext: "Your item has been delivered",
    date: "2024-02-14",
  },
  {
    id: "MOCK-103",
    name: "Denzcart Black Watch Only (2-pcs) Denzcart Digital",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
    color: "Black",
    price: 64,
    status: "Delivered",
    statusText: "Delivered on Oct 10, 2023",
    subtext: "Your item has been delivered",
    date: "2023-10-10",
  },
  {
    id: "MOCK-104",
    name: "A SARKAR MAGIC WORLD APPEARING BLACK MAGIC WAND",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    color: "Black",
    price: 219,
    status: "Delivered",
    statusText: "Delivered on May 02, 2021",
    subtext: "Your item has been delivered",
    date: "2021-05-02",
  },
];

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [apiOrders, setApiOrders] = useState([]);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);
  const [selectedTimeFilters, setSelectedTimeFilters] = useState([]);
  const navigate = useNavigate();
  const { user } = useShop();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    apiRequest("/orders")
      .then((data) => {
        if (data && data.orders) {
          setApiOrders(data.orders);
        }
      })
      .catch(() => {
        // fallback
      });
  }, [user, navigate]);

  // Combine real user orders and mock historical orders
  const allOrdersList = useMemo(() => {
    let cancelledIds = [];
    try {
      cancelledIds = JSON.parse(localStorage.getItem("flipkart_cancelled_orders") || "[]");
    } catch {
      // ignore
    }

    const formattedApi = apiOrders.flatMap((order) =>
      (order.items || []).map((item, idx) => {
        const isCancelled = order.status === "cancelled" || cancelledIds.includes(String(order.id));
        return {
          id: `${order.id}-${idx}`,
          orderId: order.id,
          name: item.productName || item.name || "Product Item",
          image: item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
          color: "Black",
          price: item.unitPrice || item.price || 393,
          status: isCancelled ? "Cancelled" : "Delivered",
          statusText: isCancelled ? "Cancelled Today, Sep 24" : "Delivered on Sep 29, Tue",
          subtext: isCancelled ? "Your order was cancelled as per your request." : "Your item has been delivered",
          date: order.created_at || "2026-09-23",
        };
      })
    );

    const formattedMock = defaultMockOrders.map((item) => {
      const isCancelled = cancelledIds.includes(item.id) || cancelledIds.includes(item.orderId);
      if (isCancelled) {
        return {
          ...item,
          status: "Cancelled",
          statusText: "Cancelled Today, Sep 24",
          subtext: "Your order was cancelled as per your request.",
        };
      }
      return item;
    });


    return [...formattedApi, ...formattedMock];
  }, [apiOrders]);


  const handleStatusCheck = (statusVal) => {
    setSelectedStatusFilters((prev) =>
      prev.includes(statusVal) ? prev.filter((s) => s !== statusVal) : [...prev, statusVal]
    );
  };

  const handleTimeCheck = (timeVal) => {
    setSelectedTimeFilters((prev) =>
      prev.includes(timeVal) ? prev.filter((t) => t !== timeVal) : [...prev, timeVal]
    );
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return allOrdersList.filter((item) => {
      // Order query search
      if (orderQuery.trim()) {
        const q = orderQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }

      // Status filter
      if (selectedStatusFilters.length > 0) {
        if (!selectedStatusFilters.includes(item.status)) return false;
      }

      // Time filter
      if (selectedTimeFilters.length > 0) {
        const itemYear = new Date(item.date).getFullYear().toString();
        let matchesTime = false;

        if (selectedTimeFilters.includes("Last 30 days")) {
          const itemDate = new Date(item.date);
          const diffDays = (new Date() - itemDate) / (1000 * 3600 * 24);
          if (diffDays <= 30) matchesTime = true;
        }
        if (selectedTimeFilters.includes("2024") && itemYear === "2024") matchesTime = true;
        if (selectedTimeFilters.includes("2023") && itemYear === "2023") matchesTime = true;
        if (selectedTimeFilters.includes("Older") && parseInt(itemYear) < 2023) matchesTime = true;

        if (!matchesTime) return false;
      }

      return true;
    });
  }, [allOrdersList, orderQuery, selectedStatusFilters, selectedTimeFilters]);

  return (
    <div className="orders-page-wrapper">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="orders-container">
        {/* Breadcrumb */}
        <div className="breadcrumb-bar">
          <span>Home</span> &gt; <span>My Account</span> &gt; <span className="active">My Orders</span>
        </div>

        <div className="orders-grid-layout">
          {/* Left Column: Filters Sidebar */}
          <aside className="orders-filters-sidebar">
            <h2 className="filters-title">Filters</h2>

            <div className="filter-group">
              <h3 className="filter-group-title">ORDER STATUS</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedStatusFilters.includes("On the way")}
                  onChange={() => handleStatusCheck("On the way")}
                />
                <span>On the way</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedStatusFilters.includes("Delivered")}
                  onChange={() => handleStatusCheck("Delivered")}
                />
                <span>Delivered</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedStatusFilters.includes("Cancelled")}
                  onChange={() => handleStatusCheck("Cancelled")}
                />
                <span>Cancelled</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedStatusFilters.includes("Returned")}
                  onChange={() => handleStatusCheck("Returned")}
                />
                <span>Returned</span>
              </label>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">ORDER TIME</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTimeFilters.includes("Last 30 days")}
                  onChange={() => handleTimeCheck("Last 30 days")}
                />
                <span>Last 30 days</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTimeFilters.includes("2024")}
                  onChange={() => handleTimeCheck("2024")}
                />
                <span>2024</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTimeFilters.includes("2023")}
                  onChange={() => handleTimeCheck("2023")}
                />
                <span>2023</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTimeFilters.includes("Older")}
                  onChange={() => handleTimeCheck("Older")}
                />
                <span>Older</span>
              </label>
            </div>
          </aside>

          {/* Right Column: Search + Orders List */}
          <section className="orders-main-content">
            {/* Search Input Bar */}
            <div className="orders-search-bar">
              <input
                type="text"
                placeholder="Search your orders here"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
              />
              <button type="button" className="search-orders-btn">
                <FiSearch /> Search Orders
              </button>
            </div>

            {/* Orders List Cards */}
            <div className="orders-list-cards">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((item) => (
                  <article
                    className="order-card-row"
                    key={item.id}
                    onClick={() => navigate(`/order_details?order_id=${item.orderId || item.id}`)}
                  >
                    <div className="order-product-col">
                      <img src={item.image} alt={item.name} className="order-thumb" />
                      <div className="order-product-info">
                        <h4 className="order-product-title">{item.name}</h4>
                        <p className="order-product-meta">
                          {item.color ? `Color: ${item.color}` : ""}
                          {item.size ? `  Size: ${item.size}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="order-price-col">
                      <strong>₹{item.price.toLocaleString()}</strong>
                    </div>

                    <div className="order-status-col">
                      <div className="status-indicator-line">
                        <span className={`status-dot ${item.status === "Cancelled" ? "cancelled" : "delivered"}`} />
                        <strong className="status-text">{item.statusText}</strong>
                      </div>
                      <p className="status-subtext">{item.subtext}</p>

                      {item.status !== "Cancelled" && (
                        <button
                          type="button"
                          className="rate-review-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.alert("Rate & Review feature: Thank you for your feedback!");
                          }}
                        >
                          <FiStar className="star-icon" /> Rate &amp; Review Product
                        </button>
                      )}
                    </div>
                  </article>

                ))
              ) : (
                <div className="no-orders-found">
                  <p>No matching orders found.</p>
                </div>
              )}
            </div>

            {/* End of List Badge */}
            <div className="end-results-badge-wrapper">
              <div className="end-results-badge">
                No More Results To Display
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
