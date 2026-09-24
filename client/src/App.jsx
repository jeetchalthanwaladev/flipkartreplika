import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrdersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import GiftCardsPage from "./pages/GiftCardsPage";
import LoginModal from "./components/LoginModal";
import { ShopProvider } from "./context/ShopContext";

import OrderResponsePage from "./pages/OrderResponsePage";
import CancelOrderPage from "./pages/CancelOrderPage";

function App() {

  return (
    <ShopProvider>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/addresses" element={<ProfilePage defaultTab="addresses" />} />
          <Route path="/account/pancard" element={<ProfilePage defaultTab="pan" />} />
          <Route path="/account/vpadetails" element={<ProfilePage defaultTab="upi" />} />
          <Route path="/account/upi" element={<ProfilePage defaultTab="upi" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          <Route path="/account/orders/:id" element={<OrderTrackingPage />} />
          <Route path="/order_details" element={<OrderTrackingPage />} />
          <Route path="/orderresponse" element={<OrderResponsePage />} />
          <Route path="/orders/cancelOrder" element={<CancelOrderPage />} />
          <Route path="/orders/cancel" element={<CancelOrderPage />} />


        </Routes>
        <LoginModal />
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;