import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiShoppingCart } from "react-icons/fi";
import { useShop } from "../context/useShop";
import "../styles/pages.css";

const CartPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart, saveForLater, user, openLogin } = useShop();
  const pendingBuyNow = useRef(false);

  useEffect(() => {
    if (user && pendingBuyNow.current) {
      pendingBuyNow.current = false;
      navigate("/checkout");
    }
  }, [navigate, user]);

  const buyNow = () => {
    if (!user) {
      pendingBuyNow.current = true;
      openLogin();
      return;
    }

    navigate("/checkout");
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="cart-page-shell">
        {cart.length === 0 ? (
          <section className={`cart-empty-card ${!user ? "cart-empty-logged-out" : "page-panel empty-state"}`}>
            {!user ? (
              <>
                <FiShoppingCart className="empty-cart-icon" aria-hidden="true" />
                <h2>Missing Cart items?</h2>
                <button className="empty-cart-login" type="button" onClick={openLogin}>Login</button>
                <button className="continue-shopping-link" type="button" onClick={() => navigate("/")}>Continue Shopping</button>
              </>
            ) : (
              <>
                <h2>Your cart is empty</h2>
                <p>Add something you love and it will appear here.</p>
                <button className="primary-action" type="button" onClick={() => navigate("/")}>Continue Shopping</button>
              </>
            )}
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-column">
              <div className="saved-address-bar">
                <span>From Saved Addresses</span>
                <button type="button">Enter Delivery Pincode</button>
              </div>
              {cart.map((item) => (
                <article className="cart-page-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-meta">Delivery by Sun Sep 27</p>
                    <p><strong>₹{item.price.toLocaleString()}</strong> <span className="cart-old-price">₹{item.mrp.toLocaleString()}</span> <span className="cart-discount">{item.discount}% off</span></p>
                    <div className="quantity-controls">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <strong className="cart-item-total">₹{(item.price * item.quantity).toLocaleString()}</strong>
                  <div className="cart-item-actions">
                    <button type="button" onClick={() => saveForLater(item.id)}>Save for later</button>
                    <button type="button" onClick={() => removeFromCart(item.id)}>Remove</button>
                    <button type="button" onClick={buyNow}>Buy this now</button>
                  </div>
                </article>
              ))}
            </section>
            <aside className="cart-summary page-panel">
              <h2>Price Details</h2>
              <div className="summary-row"><span>Price ({cart.length} items)</span><strong>₹{cartTotal.toLocaleString()}</strong></div>
              <div className="summary-row"><span>Delivery</span><strong className="free-delivery">FREE</strong></div>
              <div className="summary-row summary-total"><span>Total Amount</span><strong>₹{cartTotal.toLocaleString()}</strong></div>
              <button className="place-order-button" type="button" onClick={buyNow}>Place Order</button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CartPage;
