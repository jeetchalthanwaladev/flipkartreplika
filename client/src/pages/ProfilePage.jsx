import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronRight,
  FiCreditCard,
  FiFolder,
  FiMoreVertical,
  FiPackage,
  FiPlus,
  FiPower,
  FiUser,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/useShop";
import "../styles/profilepage.css";

const ProfilePage = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    updateProfile,
    addresses,
    addAddress,
    editAddress,
    deleteAddress,
    logout,
  } = useShop();

  const [searchTerm, setSearchTerm] = useState("");

  const initialTab =
    defaultTab ||
    (location.pathname.includes("/vpadetails") || location.pathname.includes("/upi")
      ? "upi"
      : location.pathname.includes("/addresses")
      ? "addresses"
      : location.pathname.includes("/pancard")
      ? "pan"
      : "profile");
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL if location changes
  useEffect(() => {
    if (location.pathname.includes("/vpadetails") || location.pathname.includes("/upi")) {
      setActiveTab("upi");
    } else if (location.pathname.includes("/addresses")) {
      setActiveTab("addresses");
    } else if (location.pathname.includes("/pancard")) {
      setActiveTab("pan");
    } else if (location.pathname.includes("/account") || location.pathname.includes("/profile")) {
      if (!defaultTab) {
        setActiveTab("profile");
      }
    }
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "upi") {
      navigate("/account/vpadetails");
    } else if (tab === "addresses") {
      navigate("/account/addresses");
    } else if (tab === "pan") {
      navigate("/account/pancard");
    } else if (tab === "profile") {
      navigate("/account");
    }
  };

  // PAN card form state
  const [panNumber, setPanNumber] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("flipkart_user_pan"));
      return saved?.panNumber || "";
    } catch {
      return "";
    }
  });
  const [panFullName, setPanFullName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("flipkart_user_pan"));
      return saved?.panFullName || `${profile?.firstName || "JEET"} ${profile?.lastName || "CHALTHANWALA"}`.trim();
    } catch {
      return `${profile?.firstName || "JEET"} ${profile?.lastName || "CHALTHANWALA"}`.trim();
    }
  });
  const [panDeclaration, setPanDeclaration] = useState(false);
  const [panSuccess, setPanSuccess] = useState(false);

  const handlePanSubmit = (e) => {
    e.preventDefault();
    if (!panDeclaration) return;
    localStorage.setItem(
      "flipkart_user_pan",
      JSON.stringify({ panNumber, panFullName })
    );
    setPanSuccess(true);
    setTimeout(() => setPanSuccess(false), 5000);
  };

  // Edit states for personal profile sections
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState(profile?.firstName || "JEET");
  const [lastName, setLastName] = useState(profile?.lastName || "CHALTHANWALA");
  const [gender, setGender] = useState(profile?.gender || "Male");
  const [email, setEmail] = useState(profile?.email || "pateljc1115@gmail.com");
  const [phone, setPhone] = useState(profile?.phone || "+916359347716");

  // Manage Addresses state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    addressText: "",
    city: "",
    state: "Gujarat",
    type: "HOME",
  });

  const handleSavePersonal = (e) => {
    e?.preventDefault();
    updateProfile({ firstName, lastName, gender });
    setIsEditingPersonal(false);
  };

  const handleSaveEmail = (e) => {
    e?.preventDefault();
    updateProfile({ email });
    setIsEditingEmail(false);
  };

  const handleSavePhone = (e) => {
    e?.preventDefault();
    updateProfile({ phone });
    setIsEditingPhone(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      name: `${profile?.firstName || "Cahlthanwala"} ${profile?.lastName || "Jeet"}`.trim(),
      phone: profile?.phone?.replace(/\D/g, "").slice(-10) || "6359347716",
      pincode: "395003",
      locality: "Lal Darwaja",
      addressText: "",
      city: "Surat",
      state: "Gujarat",
      type: "HOME",
    });
    setShowAddForm(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.name || "",
      phone: addr.phone || "",
      pincode: addr.pincode || "",
      locality: addr.locality || "",
      addressText: addr.addressText || "",
      city: addr.city || "",
      state: addr.state || "Gujarat",
      type: addr.type || "HOME",
    });
    setShowAddForm(true);
    setOpenMenuId(null);
  };

  const handleSaveAddressForm = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      editAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setShowAddForm(false);
    setEditingAddressId(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="profile-container">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          {/* User Welcome Card */}
          <div className="profile-user-card">
            <div className="profile-avatar">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#FFE11B" />
                <path
                  d="M20 19C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11C17.7909 11 16 12.7909 16 15C16 17.2091 17.7909 19 20 19Z"
                  fill="#2874F0"
                />
                <path
                  d="M20 21C15.5817 21 12 24.5817 12 29H28C28 24.5817 24.4183 21 20 21Z"
                  fill="#2874F0"
                />
              </svg>
            </div>
            <div className="profile-user-info">
              <span className="profile-greeting">Hello,</span>
              <strong className="profile-user-name">
                {firstName} {lastName}
              </strong>
            </div>
          </div>

          {/* Navigation Menu Card */}
          <div className="profile-nav-card">
            {/* MY ORDERS */}
            <div
              className="profile-nav-section-clickable"
              onClick={() => navigate("/orders")}
              role="button"
              tabIndex={0}
            >
              <div className="profile-nav-header">
                <FiPackage className="profile-nav-icon" />
                <span>MY ORDERS</span>
              </div>
              <FiChevronRight className="profile-nav-chevron" />
            </div>

            <div className="profile-nav-divider" />

            {/* ACCOUNT SETTINGS */}
            <div className="profile-nav-section">
              <div className="profile-nav-header">
                <FiUser className="profile-nav-icon" />
                <span>ACCOUNT SETTINGS</span>
              </div>
              <div className="profile-nav-items">
                <button
                  type="button"
                  className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => handleTabChange("profile")}
                >
                  Profile Information
                </button>
                <button
                  type="button"
                  className={`profile-nav-item ${activeTab === "addresses" ? "active" : ""}`}
                  onClick={() => handleTabChange("addresses")}
                >
                  Manage Addresses
                </button>
                <button
                  type="button"
                  className={`profile-nav-item ${activeTab === "pan" ? "active" : ""}`}
                  onClick={() => handleTabChange("pan")}
                >
                  PAN Card Information
                </button>
              </div>
            </div>

            <div className="profile-nav-divider" />

            {/* PAYMENTS */}
            <div className="profile-nav-section">
              <div className="profile-nav-header">
                <FiCreditCard className="profile-nav-icon" />
                <span>PAYMENTS</span>
              </div>
              <div className="profile-nav-items">
                <button
                  type="button"
                  className="profile-nav-item payment-nav-item"
                  onClick={() => window.alert("Gift Cards feature coming soon.")}
                >
                  <span>Gift Cards</span>
                  <span className="gift-card-balance">₹0</span>
                </button>
                <button
                  type="button"
                  className={`profile-nav-item ${activeTab === "upi" ? "active" : ""}`}
                  onClick={() => handleTabChange("upi")}
                >
                  Saved UPI
                </button>
                <button
                  type="button"
                  className="profile-nav-item"
                  onClick={() => window.alert("Saved Cards feature coming soon.")}
                >
                  Saved Cards
                </button>
              </div>
            </div>

            <div className="profile-nav-divider" />

            {/* MY STUFF */}
            <div className="profile-nav-section">
              <div className="profile-nav-header">
                <FiFolder className="profile-nav-icon" />
                <span>MY STUFF</span>
              </div>
              <div className="profile-nav-items">
                <button
                  type="button"
                  className="profile-nav-item"
                  onClick={() => window.alert("My Coupons feature coming soon.")}
                >
                  My Coupons
                </button>
                <button
                  type="button"
                  className="profile-nav-item"
                  onClick={() => window.alert("My Reviews & Ratings feature coming soon.")}
                >
                  My Reviews & Ratings
                </button>
                <button
                  type="button"
                  className="profile-nav-item"
                  onClick={() => window.alert("All Notifications feature coming soon.")}
                >
                  All Notifications
                </button>
                <button
                  type="button"
                  className="profile-nav-item"
                  onClick={() => window.alert("My Wishlist feature coming soon.")}
                >
                  My Wishlist
                </button>
              </div>
            </div>

            <div className="profile-nav-divider" />

            {/* LOGOUT */}
            <div
              className="profile-nav-section-clickable logout-nav-row"
              onClick={handleLogout}
              role="button"
              tabIndex={0}
            >
              <div className="profile-nav-header">
                <FiPower className="profile-nav-icon" />
                <span>Logout</span>
              </div>
            </div>
          </div>

          {/* Frequently Visited */}
          <div className="profile-frequently-visited">
            <span className="fv-title">Frequently Visited:</span>
            <div className="fv-links">
              <button type="button" onClick={() => navigate("/orders")}>
                Track Order
              </button>
              <button type="button" onClick={() => window.alert("24x7 Customer Care is available.")}>
                Help Center
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="profile-content">
          {/* TAB 1: Profile Information */}
          {activeTab === "profile" && (
            <div className="profile-tab-view">
              {/* Personal Information */}
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Personal Information</h2>
                  {!isEditingPersonal ? (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={() => setIsEditingPersonal(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={() => setIsEditingPersonal(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePersonal}>
                  <div className="profile-input-row">
                    <div className="profile-field">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditingPersonal}
                        placeholder="First Name"
                        className={`profile-input ${!isEditingPersonal ? "disabled" : ""}`}
                      />
                    </div>
                    <div className="profile-field">
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditingPersonal}
                        placeholder="Last Name"
                        className={`profile-input ${!isEditingPersonal ? "disabled" : ""}`}
                      />
                    </div>
                  </div>

                  {isEditingPersonal && (
                    <div className="profile-save-row">
                      <button type="submit" className="profile-save-btn">
                        SAVE
                      </button>
                    </div>
                  )}

                  <div className="profile-gender-group">
                    <span className="gender-label">Your Gender</span>
                    <div className="gender-options">
                      <label className="gender-option">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={gender === "Male"}
                          onChange={() => setGender("Male")}
                          disabled={!isEditingPersonal}
                        />
                        <span>Male</span>
                      </label>
                      <label className="gender-option">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={gender === "Female"}
                          onChange={() => setGender("Female")}
                          disabled={!isEditingPersonal}
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Email Address */}
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Email Address</h2>
                  {!isEditingEmail ? (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={() => setIsEditingEmail(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={() => setIsEditingEmail(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveEmail}>
                  <div className="profile-input-row single-field">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditingEmail}
                      placeholder="Email Address"
                      className={`profile-input ${!isEditingEmail ? "disabled" : ""}`}
                    />
                  </div>

                  {isEditingEmail && (
                    <div className="profile-save-row">
                      <button type="submit" className="profile-save-btn">
                        SAVE
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Mobile Number */}
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Mobile Number</h2>
                  {!isEditingPhone ? (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={() => setIsEditingPhone(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="profile-edit-btn"
                      onClick={() => setIsEditingPhone(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePhone}>
                  <div className="profile-input-row single-field">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditingPhone}
                      placeholder="Mobile Number"
                      className={`profile-input ${!isEditingPhone ? "disabled" : ""}`}
                    />
                  </div>

                  {isEditingPhone && (
                    <div className="profile-save-row">
                      <button type="submit" className="profile-save-btn">
                        SAVE
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* FAQs Section */}
              <div className="profile-faqs">
                <h3 className="faqs-title">FAQs</h3>

                <div className="faq-item">
                  <h4>What happens when I update my email address (or mobile number)?</h4>
                  <p>
                    Your login email id (or mobile number) changes, likewise. You&apos;ll receive all your
                    account related communication on your updated email address (or mobile number).
                  </p>
                </div>

                <div className="faq-item">
                  <h4>When will my Flipkart account be updated with the new email address (or mobile number)?</h4>
                  <p>
                    It happens as soon as you confirm the verification code sent to your email (or mobile) and
                    save the changes.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>What happens to my existing Flipkart account when I update my email address (or mobile number)?</h4>
                  <p>
                    Updating your email address (or mobile number) doesn&apos;t invalidate your account. Your
                    account remains fully functional. You&apos;ll continue seeing your Order history, saved
                    information and personal details.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>Does my Seller account get affected when I update my email address?</h4>
                  <p>
                    Flipkart has a &apos;single sign-on&apos; policy. Any changes will reflect in your Seller
                    account also.
                  </p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="profile-actions">
                <button
                  type="button"
                  className="action-link-deactivate"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to deactivate your account?")) {
                      handleLogout();
                    }
                  }}
                >
                  Deactivate Account
                </button>
                <button
                  type="button"
                  className="action-link-delete"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your Flipkart account? This cannot be undone.")) {
                      handleLogout();
                    }
                  }}
                >
                  Delete Account
                </button>
              </div>

              {/* Bottom Illustration Banner */}
              <div className="profile-bottom-illustration">
                <svg
                  viewBox="0 0 800 120"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="illustration-svg"
                >
                  <path
                    d="M0 120H800V80C700 65 620 70 540 85C460 100 380 90 300 70C220 50 120 75 0 85V120Z"
                    fill="#FFDE25"
                  />
                  <path
                    d="M0 120H800V95C720 85 640 90 560 100C480 110 390 105 310 90C230 75 140 90 0 100V120Z"
                    fill="#F7C900"
                  />
                  <path
                    d="M500 120C520 105 570 95 620 90"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                  />
                  <circle cx="80" cy="85" r="5" fill="#4CAF50" />
                  <circle cx="75" cy="80" r="4.5" fill="#E53935" />
                  <line x1="80" y1="85" x2="80" y2="95" stroke="#795548" strokeWidth="2" />
                  <circle cx="720" cy="80" r="5.5" fill="#E53935" />
                  <circle cx="725" cy="74" r="4" fill="#4CAF50" />
                  <line x1="720" y1="80" x2="720" y2="92" stroke="#795548" strokeWidth="2" />
                  <g transform="translate(620, 20) scale(1.2)">
                    <polygon points="0,30 35,0 12,35" fill="#FFC107" />
                    <polygon points="35,0 12,35 20,40" fill="#FFA000" />
                    <polygon points="0,30 35,0 8,24" fill="#FFE082" />
                    <path
                      d="M-8 34L-1 33"
                      stroke="#FFC107"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-12 40L-4 38"
                      stroke="#FFC107"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>
            </div>
          )}

          {/* TAB 2: Manage Addresses */}
          {activeTab === "addresses" && (
            <div className="manage-addresses-view">
              <h2 className="manage-addresses-title">Manage Addresses</h2>

              {/* Add New Address Button Card */}
              {!showAddForm ? (
                <div
                  className="add-address-btn-card"
                  onClick={handleOpenAddAddress}
                  role="button"
                  tabIndex={0}
                >
                  <FiPlus className="add-address-plus-icon" />
                  <span>ADD A NEW ADDRESS</span>
                </div>
              ) : (
                <div className="address-form-card">
                  <h3 className="address-form-title">
                    {editingAddressId ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
                  </h3>
                  <form onSubmit={handleSaveAddressForm}>
                    <div className="address-form-grid">
                      <div className="address-form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          required
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          placeholder="Name"
                          className="profile-input"
                        />
                      </div>
                      <div className="address-form-group">
                        <label>10-digit mobile number</label>
                        <input
                          type="tel"
                          required
                          maxLength="10"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          placeholder="10-digit mobile number"
                          className="profile-input"
                        />
                      </div>
                      <div className="address-form-group">
                        <label>Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength="6"
                          value={addressForm.pincode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              pincode: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          placeholder="Pincode"
                          className="profile-input"
                        />
                      </div>
                      <div className="address-form-group">
                        <label>Locality</label>
                        <input
                          type="text"
                          required
                          value={addressForm.locality}
                          onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                          placeholder="Locality"
                          className="profile-input"
                        />
                      </div>
                      <div className="address-form-group full-width">
                        <label>Address (Area and Street)</label>
                        <textarea
                          rows="3"
                          required
                          value={addressForm.addressText}
                          onChange={(e) => setAddressForm({ ...addressForm, addressText: e.target.value })}
                          placeholder="Address (Area and Street)"
                          className="profile-input profile-textarea"
                        />
                      </div>
                      <div className="address-form-group">
                        <label>City/District/Town</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="City/District/Town"
                          className="profile-input"
                        />
                      </div>
                      <div className="address-form-group">
                        <label>State</label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="profile-input profile-select"
                        >
                          <option value="Gujarat">Gujarat</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                        </select>
                      </div>
                    </div>

                    <div className="address-type-group">
                      <span className="address-type-label">Address Type</span>
                      <div className="address-type-radios">
                        <label className="gender-option">
                          <input
                            type="radio"
                            name="addressType"
                            value="HOME"
                            checked={addressForm.type === "HOME"}
                            onChange={() => setAddressForm({ ...addressForm, type: "HOME" })}
                          />
                          <span>Home</span>
                        </label>
                        <label className="gender-option">
                          <input
                            type="radio"
                            name="addressType"
                            value="WORK"
                            checked={addressForm.type === "WORK"}
                            onChange={() => setAddressForm({ ...addressForm, type: "WORK" })}
                          />
                          <span>Work</span>
                        </label>
                      </div>
                    </div>

                    <div className="address-form-actions">
                      <button type="submit" className="profile-save-btn">
                        SAVE
                      </button>
                      <button
                        type="button"
                        className="address-cancel-btn"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingAddressId(null);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* List of Saved Addresses */}
              <div className="addresses-list">
                {addresses.map((addr) => (
                  <div className="address-card" key={addr.id}>
                    <div className="address-card-top">
                      <span className="address-type-badge">{addr.type || "HOME"}</span>
                      <div className="address-menu-wrapper">
                        <button
                          type="button"
                          className="address-menu-trigger"
                          onClick={() => setOpenMenuId(openMenuId === addr.id ? null : addr.id)}
                          aria-label="Address options"
                        >
                          <FiMoreVertical />
                        </button>
                        {openMenuId === addr.id && (
                          <div className="address-dropdown-menu">
                            <button
                              type="button"
                              onClick={() => handleOpenEditAddress(addr)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="delete-option"
                              onClick={() => {
                                deleteAddress(addr.id);
                                setOpenMenuId(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="address-card-header">
                      <strong className="address-name">{addr.name}</strong>
                      <strong className="address-phone">{addr.phone}</strong>
                    </div>

                    <p className="address-text">
                      {addr.addressText ||
                        `${addr.address || ""}, ${addr.locality || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAN Card Information */}
          {activeTab === "pan" && (
            <div className="pancard-tab-view">
              <h2 className="pancard-title">PAN Card Information</h2>

              <form onSubmit={handlePanSubmit} className="pancard-form">
                <div className="pancard-form-group">
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="PAN Card Number"
                    className="pancard-input focused-pancard"
                  />
                </div>

                <div className="pancard-form-group">
                  <input
                    type="text"
                    required
                    value={panFullName}
                    onChange={(e) => setPanFullName(e.target.value)}
                    placeholder="Full Name"
                    className="pancard-input"
                  />
                </div>

                <div className="pancard-file-card">
                  <span className="pancard-file-label">
                    Upload PAN Card (Only JPEG file is allowed)
                  </span>
                  <div className="pancard-file-input-wrapper">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,image/jpeg"
                      className="pancard-file-input"
                    />
                  </div>
                </div>

                <div className="pancard-declaration-group">
                  <label className="pancard-declaration-label">
                    <input
                      type="checkbox"
                      checked={panDeclaration}
                      onChange={(e) => setPanDeclaration(e.target.checked)}
                      className="pancard-checkbox"
                    />
                    <span>
                      I do hereby declare that PAN furnished/stated above is correct and belongs to me, registered as an account holder with www.flipkart.com. I further declare that I shall solely be held responsible for the consequences, in case of any false PAN declaration.
                    </span>
                  </label>
                </div>

                {panSuccess && (
                  <p className="pancard-success-msg">
                    ✓ PAN Card details uploaded successfully!
                  </p>
                )}

                <div className="pancard-action-row">
                  <button
                    type="submit"
                    className="pancard-upload-btn"
                    disabled={!panDeclaration || !panNumber || !panFullName}
                  >
                    UPLOAD
                  </button>
                </div>

                <div className="pancard-terms-row">
                  <button
                    type="button"
                    className="pancard-terms-link"
                    onClick={() =>
                      window.alert(
                        "PAN Card Information Terms & Conditions:\n\n1. PAN furnished is solely for tax compliance and verification under applicable laws.\n2. Any false declaration may lead to legal consequences and suspension of Flipkart services."
                      )
                    }
                  >
                    Read Terms & Conditions of PAN Card Information
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: Saved UPI (vpadetails) */}
          {activeTab === "upi" && (
            <div className="upi-tab-view">
              <h2 className="upi-empty-title">No VPAs saved to be shown</h2>

              <div className="upi-faqs-section">
                <h3 className="upi-faqs-heading">FAQs</h3>

                <div className="upi-faq-item">
                  <h4>Why is my UPI being saved on Flipkart?</h4>
                  <p>
                    It&apos;s quicker. You can save the hassle of typing in the complete UPI information every time you shop at Flipkart by saving your UPI details. You can make your payment by selecting the saved UPI ID of your choice at checkout. While this is obviously faster, it is also very secure.
                  </p>
                </div>

                <div className="upi-faq-item">
                  <h4>Is it safe to save my UPI on Flipkart?</h4>
                  <p>
                    Absolutely. Your UPI ID information is 100 percent safe with us. UPI ID details are non PCI compliant and are non confidential data.
                  </p>
                </div>

                <div className="upi-faq-item">
                  <h4>What all UPI information does Flipkart store?</h4>
                  <p>
                    Flipkart only stores UPI ID and payment provider details. We do not store UPI PIN/MPIN.
                  </p>
                </div>

                <div className="upi-faq-item">
                  <h4>Can I delete my saved UPI?</h4>
                  <p>
                    Yes, you can delete your UPI ID at any given time.
                  </p>
                </div>

                <a
                  href="#"
                  className="upi-view-all-faqs"
                  onClick={(e) => {
                    e.preventDefault();
                    window.alert("Showing all UPI FAQs.");
                  }}
                >
                  View all FAQs &gt;
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
