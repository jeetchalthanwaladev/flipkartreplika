import {
  FiChevronRight,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiBell,
  FiHeadphones,
  FiPlusCircle,
  FiPackage,
  FiHeart,
  FiShoppingBag,
  FiGift,
  FiCreditCard,
  FiTrendingUp,
  FiDownload,
  FiLogOut,
} from "react-icons/fi";
import { FaPlane } from "react-icons/fa6";
import { BsShop, BsMegaphone } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";
import { useShop } from "../context/useShop";

const Navbar = ({
  searchTerm,
  onSearchChange,
  onCartClick,
  onBrandClick,
  products = [],
  isScrolled = false,
}) => {
  const navigate = useNavigate();
  const { cart, logout, user } = useShop();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showLoginNudge, setShowLoginNudge] = useState(false);

  useEffect(() => {
    if (user || sessionStorage.getItem("flipkart_login_nudge_seen")) return undefined;

    const showTimer = window.setTimeout(() => {
      setShowLoginNudge(true);
      sessionStorage.setItem("flipkart_login_nudge_seen", "true");
    }, 3000);
    const hideTimer = window.setTimeout(() => setShowLoginNudge(false), 8000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [user]);

  const suggestions = searchTerm.trim()
    ? products.filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    }).slice(0, 8)
    : [];

  const handleBrandClick = () => {
    if (onBrandClick) {
      onBrandClick();
    }
    navigate("/");
  };

  const handleProtectedAction = (action) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (typeof action === "function") {
      action();
    }
  };

  return (
    <header className={`navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-topbar">
        <div className="brand-switcher" aria-label="Brand switcher">
          <button className="brand-option brand-option-active" type="button" onClick={handleBrandClick}>
            <span className="flipkart-mark">F</span>
            <span>Flipkart</span>
          </button>
          <button className="brand-option" type="button" onClick={handleBrandClick}>
            <FaPlane className="travel-mark" />
            <span>Travel</span>
          </button>
        </div>

        <div className="delivery-location">
          <FiMapPin />
          <span>Location not set</span>
          <button type="button" onClick={() => window.alert("Delivery location selection will be available soon.")}>
            Select delivery location
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="navbar-container">
        <div className={`navbar-search ${searchFocused ? "search-focused" : ""}`}>
          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
          />

          {searchFocused && searchTerm.trim() && (
            <div className="search-suggestions" role="listbox">
              {suggestions.length > 0 ? suggestions.map((product) => (
                <button
                  className="search-suggestion"
                  type="button"
                  key={product.id}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSearchChange(product.name);
                    setSearchFocused(false);
                    navigate("/");
                  }}
                >
                  <img src={product.image} alt="" />
                  <span>
                    <strong>{product.name}</strong>
                    <small>in {product.category}</small>
                  </span>
                </button>
              )) : (
                <p className="search-empty">No matching products found</p>
              )}
            </div>
          )}
        </div>

        <div className={`login-dropdown-wrapper ${!user ? "logged-out-login" : ""}`}>
          <button className="login-button" onClick={() => (user ? navigate("/orders") : navigate("/login"))}>
            <FiUser />
            <span>{user ? "Account" : "Login"}</span>
            <FiChevronDown className="login-arrow-down" />
            <FiChevronUp className="login-arrow-up" />
          </button>

          {!user && showLoginNudge && (
            <button className="login-nudge" type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          )}

          <div className="login-dropdown-menu">
            <div className="login-menu-header">
              {user ? (
                <span>Hello, <strong>{user.phone || "Customer"}</strong></span>
              ) : (
                <>
                  <span>New customer?</span>
                  <button type="button" className="login-menu-signup" onClick={() => navigate("/login")}>
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <div className="login-menu-items">
              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => navigate("/orders"))}
              >
                <FiUser className="menu-icon" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Flipkart Plus Zone feature coming soon."))}
              >
                <FiPlusCircle className="menu-icon" />
                <span>Flipkart Plus Zone</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => navigate("/orders"))}
              >
                <FiPackage className="menu-icon" />
                <span>Orders</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Wishlist feature coming soon."))}
              >
                <FiHeart className="menu-icon" />
                <span>Wishlist</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Become a Seller feature coming soon."))}
              >
                <FiShoppingBag className="menu-icon" />
                <span>Become a Seller</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Rewards feature coming soon."))}
              >
                <FiGift className="menu-icon" />
                <span>Rewards</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Gift Cards feature coming soon."))}
              >
                <FiCreditCard className="menu-icon" />
                <span>Gift Cards</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Notification Preferences feature coming soon."))}
              >
                <FiBell className="menu-icon" />
                <span>Notification Preferences</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("24x7 Customer Care feature coming soon."))}
              >
                <FiHeadphones className="menu-icon" />
                <span>24x7 Customer Care</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Advertise feature coming soon."))}
              >
                <FiTrendingUp className="menu-icon" />
                <span>Advertise</span>
              </button>

              <button
                type="button"
                className="login-menu-item"
                onClick={() => handleProtectedAction(() => window.alert("Download App feature coming soon."))}
              >
                <FiDownload className="menu-icon" />
                <span>Download App</span>
              </button>

              {user && (
                <button
                  type="button"
                  className="login-menu-item logout-item"
                  onClick={logout}
                >
                  <FiLogOut className="menu-icon" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="more-dropdown-wrapper">
          <button className="nav-link more-link">
            More
            <FiChevronDown className="more-arrow-down" />
            <FiChevronUp className="more-arrow-up" />
          </button>
          <div className="more-dropdown-menu">
            <div className="more-dropdown-header">More</div>
            <a href="#" className="more-dropdown-item" onClick={(e) => e.preventDefault()}>
              <BsShop className="more-dropdown-icon" />
              <span>Become a Seller</span>
            </a>
            <a href="#" className="more-dropdown-item" onClick={(e) => e.preventDefault()}>
              <FiBell className="more-dropdown-icon" />
              <span>Notification Settings</span>
            </a>
            <a href="#" className="more-dropdown-item" onClick={(e) => e.preventDefault()}>
              <FiHeadphones className="more-dropdown-icon" />
              <span>24x7 Customer Care</span>
            </a>
            <a href="#" className="more-dropdown-item" onClick={(e) => e.preventDefault()}>
              <BsMegaphone className="more-dropdown-icon" />
              <span>Advertise on Flipkart</span>
            </a>
          </div>
        </div>

        <button className="cart-link" onClick={onCartClick || (() => navigate("/cart"))}>
          <FiShoppingCart />
          <span>Cart</span>
          <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
        </button>

      </div>
    </header>
  );
};

export default Navbar;