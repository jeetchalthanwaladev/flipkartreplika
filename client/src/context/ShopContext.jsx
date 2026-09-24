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
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("flipkart_user_profile");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      firstName: "JEET",
      lastName: "CHALTHANWALA",
      gender: "Male",
      email: "pateljc1115@gmail.com",
      phone: "+916359347716",
    };
  });

  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem("flipkart_user_address");
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: "Cahlthanwala Jeet",
      phone: "6359347716",
      pincode: "395003",
      locality: "Lal Darwaja",
      addressText: "6/1638, 3rd flor, Siv sadan Apartment, Gundi sheri, Lal Darwaja, surat",
      city: "Surat",
      state: "Gujarat",
      type: "HOME"
    };
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("flipkart_user_addresses");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 1,
        name: "Cahlthanwala Jeet",
        phone: "6359347716",
        pincode: "395003",
        locality: "Lal Darwaja",
        addressText: "6/1638, 3rd flor, Siv sadan Apartment, Gundi sheri, Lal Darwaja,surat - 395003, Siv sadan Apartment, Lal Darwaja, Surat, Gujarat - 395003",
        city: "Surat",
        state: "Gujarat",
        type: "HOME"
      },
      {
        id: 2,
        name: "JC PATEL",
        phone: "6359347716",
        pincode: "395003",
        locality: "Lal Darwaza",
        addressText: "6/1638 ,Gndisery, Lal Darwaza,surat, Surat, Gujarat - 395003",
        city: "Surat",
        state: "Gujarat",
        type: "HOME"
      }
    ];
  });

  const addAddress = useCallback((newAddr) => {
    setAddresses((prev) => {
      const item = { ...newAddr, id: Date.now() };
      const next = [item, ...prev];
      localStorage.setItem("flipkart_user_addresses", JSON.stringify(next));
      return next;
    });
  }, []);

  const editAddress = useCallback((id, updated) => {
    setAddresses((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      localStorage.setItem("flipkart_user_addresses", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem("flipkart_user_addresses", JSON.stringify(next));
      return next;
    });
  }, []);

  const saveAddress = useCallback((newAddress) => {
    setAddress(newAddress);
    if (newAddress) {
      localStorage.setItem("flipkart_user_address", JSON.stringify(newAddress));
    } else {
      localStorage.removeItem("flipkart_user_address");
    }
  }, []);

  const updateProfile = useCallback((updatedData) => {
    setProfile((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem("flipkart_user_profile", JSON.stringify(next));
      return next;
    });
  }, []);

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
  const requestOtp = useCallback(async (phone) => {
    const result = await apiRequest("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    return result;
  }, []);

  const verifyOtp = useCallback(async (phone, otp) => {
    const result = await apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
    if (result.user) {
      setUser(result.user);
      setProfile((prev) => ({
        ...prev,
        phone: `+91${phone.slice(-10)}`,
      }));
    }
    closeLogin();
    return result;
  }, [closeLogin]);

  const login = useCallback(async (phone) => {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    setUser(result.user);
    closeLogin();
    return result.user;
  }, [closeLogin]);
  const signup = useCallback(async (phone) => {
    const result = await apiRequest("/auth/signup", {
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
        profile,
        updateProfile,
        address,
        saveAddress,
        addresses,
        addAddress,
        editAddress,
        deleteAddress,
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
        signup,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}