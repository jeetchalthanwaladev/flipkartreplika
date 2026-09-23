import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";

import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-column">
          <h4>ABOUT</h4>

          <a href="#">Contact Us</a>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Corporate Information</a>
        </div>

        <div className="footer-column">
          <h4>GROUP COMPANIES</h4>

          <a href="#">FlipKart Wholesale</a>
          <a href="#">FlipKart Plus</a>
          <a href="#">FlipKart Ads</a>
          <a href="#">FlipKart Travel</a>
        </div>

        <div className="footer-column">
          <h4>HELP</h4>

          <a href="#">Payments</a>
          <a href="#">Shipping</a>
          <a href="#">Cancellation & Returns</a>
          <a href="#">FAQ</a>
          <a href="#">Report Infringement</a>
        </div>

        <div className="footer-column">
          <h4>CONSUMER POLICY</h4>

          <a href="#">Cancellation & Returns</a>
          <a href="#">Terms Of Use</a>
          <a href="#">Security</a>
          <a href="#">Privacy</a>
          <a href="#">Sitemap</a>
        </div>

        <div className="footer-column address-column">
          <h4>REGISTERED OFFICE</h4>

          <p>
            FlipKart Internet Private Limited
          </p>

          <p>
            Building 1, Business Park,
            Gujarat, India
          </p>

          <p>
            Email: support@flipkart.demo
          </p>
        </div>

      </div>

      <div className="footer-bottom">

        <span>© 2026 FlipKart Demo</span>

        <div className="social-icons">
          <FiFacebook />
          <FiTwitter />
          <FiInstagram />
          <FiYoutube />
        </div>

      </div>

    </footer>
  );
};

export default Footer;