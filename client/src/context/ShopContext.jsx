import { useCallback, useEffect, useMemo, useState } from "react";
import { ShopContext } from "./shopContextValue";
import { apiRequest } from "../services/api";

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("flipkart_cart")) || [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState([]);
  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("flipkart_saved_for_later")) || [];
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("flipkart_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("flipkart_saved_for_later", JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    apiRequest("/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null));
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) =>
      currentWishlist.some((item) => item.id === product.id)
        ? currentWishlist.filter((item) => item.id !== product.id)
        : [...currentWishlist, product],
    );
  };

  const removeFromCart = useCallback((productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }, []);

  const saveForLater = useCallback((productId) => {
    setCart((currentCart) => {
      const item = currentCart.find((product) => product.id === productId);
      if (item) setSavedForLater((currentSaved) => currentSaved.some((product) => product.id === productId) ? currentSaved : [...currentSaved, item]);
      return currentCart.filter((product) => product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) => currentCart.map((item) => item.id === productId ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);
  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const login = useCallback(async (phone) => {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    setUser(result.user);
    closeLogin();
    return result.user;
  }, [closeLogin]);
  const logout = useCallback(async () => {
    await apiRequest("/auth/logout", { method: "POST" });
    setUser(null);
  }, []);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartTotal,
        wishlist,
        savedForLater,
        user,
        loginOpen,
        addToCart,
        toggleWishlist,
        removeFromCart,
        saveForLater,
        updateQuantity,
        clearCart,
        openLogin,
        closeLogin,
        login,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}