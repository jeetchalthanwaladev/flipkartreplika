import { useState } from "react";
import { FiChevronRight, FiCreditCard, FiGift, FiHelpCircle, FiPlus, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/useShop";
import "../styles/giftcards.css";

const GiftCardsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, openLogin } = useShop();

  if (!user) {
    return (
      <>
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <main className="gift-login-state">
          <FiGift />
          <h1>Login to view your Gift Cards</h1>
          <p>Sign in to check your balance, redeem cards and see your gift card activity.</p>
          <button type="button" onClick={openLogin}>Login</button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="account-page-shell">
        <aside className="account-sidebar">
          <button type="button" className="account-user-card" onClick={() => navigate("/account")}>
            <span className="account-avatar">{user.phone?.slice(-2) || "U"}</span>
            <span><small>Hello,</small><strong>{user.phone}</strong></span>
            <FiChevronRight />
          </button>
          <nav className="account-nav">
            <button type="button" onClick={() => navigate("/account")}><FiCreditCard /> My Account</button>
            <button type="button" onClick={() => navigate("/orders")}><FiGift /> My Orders</button>
            <button type="button" className="active"><FiCreditCard /> Gift Cards</button>
            <button type="button" onClick={() => window.alert("Help Center coming soon.")}><FiHelpCircle /> Help Center</button>
          </nav>
        </aside>

        <section className="gift-content">
          <div className="gift-heading-row"><div><h1>Gift Cards</h1><p>Send thoughtful gifts or use your balance at checkout.</p></div><button type="button" onClick={() => window.alert("Gift card purchase flow coming soon.")}><FiPlus /> Buy a Gift Card</button></div>

          <section className="gift-hero-card">
            <div><span className="gift-eyebrow">FLIPKART GIFT CARDS</span><h2>Make every occasion brighter</h2><p>Gift more choice with a Flipkart Gift Card.</p><button type="button" onClick={() => window.alert("Gift card purchase flow coming soon.")}>Explore Gift Cards</button></div>
            <FiGift className="gift-hero-icon" />
          </section>

          <div className="gift-card-grid">
            <section className="gift-panel gift-balance-panel"><div className="gift-panel-title"><span><FiCreditCard /> Gift Card Balance</span><FiShield /></div><strong>₹0</strong><p>No active gift card balance</p><button type="button" onClick={() => window.alert("Redeem flow coming soon.")}>Redeem Gift Card</button></section>
            <section className="gift-panel"><div className="gift-panel-title"><span><FiHelpCircle /> Need help?</span></div><p>Have a question about your gift card, balance or redemption?</p><button className="gift-text-button" type="button" onClick={() => window.alert("Help Center coming soon.")}>Visit Help Center <FiChevronRight /></button></section>
          </div>

          <section className="gift-panel gift-activity"><div className="gift-panel-title"><span>Gift Card Activity</span></div><div className="gift-empty-activity"><FiGift /><p>Your gift card transactions will appear here.</p></div></section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default GiftCardsPage;