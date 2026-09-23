import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

import "../styles/home.css";

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    rating: 4.4,
    reviews: 245,
    price: 1299,
    mrp: 2499,
    discount: 48,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch Series 9",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    rating: 4.5,
    reviews: 512,
    price: 1999,
    mrp: 3999,
    discount: 50,
    category: "Mobiles",
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    rating: 4.3,
    reviews: 183,
    price: 1499,
    mrp: 2999,
    discount: 50,
    category: "Fashion",
  },
  {
    id: 4,
    name: "Modern Backpack",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    rating: 4.2,
    reviews: 98,
    price: 899,
    mrp: 1799,
    discount: 50,
    category: "Fashion",
  },
  {
    id: 5,
    name: "Premium Sunglasses",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    rating: 4.6,
    reviews: 321,
    price: 799,
    mrp: 1599,
    discount: 50,
    category: "Fashion",
  },
];

const heroBanners = [
  {
    eyebrow: "BIG SAVINGS EVERY DAY",
    title: "Smart sound, better days",
    detail: "Premium audio from ₹1,299",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
  },
  {
    eyebrow: "FASHION SALE IS LIVE",
    title: "Carry your style everywhere",
    detail: "Trending picks up to 50% off",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200",
  },
  {
    eyebrow: "SMART LIVING, BETTER VALUE",
    title: "Time that keeps up",
    detail: "Smart watches from ₹1,999",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
  },
  {
    eyebrow: "STYLE YOUR EVERYDAY",
    title: "Step into something new",
    detail: "Fresh fashion picks up to 50% off",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
  },
   {
    eyebrow: "BIG SAVINGS EVERY DAY",
    title: "Smart sound, better days",
    detail: "Premium audio from ₹1,299",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
  },
  {
    eyebrow: "FASHION SALE IS LIVE",
    title: "Carry your style everywhere",
    detail: "Trending picks up to 50% off",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200",
  },
  {
    eyebrow: "SMART LIVING, BETTER VALUE",
    title: "Time that keeps up",
    detail: "Smart watches from ₹1,999",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
  },
  {
    eyebrow: "STYLE YOUR EVERYDAY",
    title: "Step into something new",
    detail: "Fresh fashion picks up to 50% off",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
  },
];

const adCards = [
  {
    title: "Statement sunglasses",
    offer: "From ₹799",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
  },
  {
    title: "Roll with ease",
    offer: "Min. 50% Off",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
  },
  {
    title: "Premium tech picks",
    offer: "From ₹1,999",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [searchTerm, setSearchTerm] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const productsRef = useRef(null);
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((currentSlide) => (currentSlide + 1) % 4);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "For You" || product.category === activeCategory;
      const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const showProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    showProducts();
  };

  return (
    <div className="home">

      <div className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <Navbar
          isScrolled={isScrolled}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          products={products}
          onCartClick={() => navigate("/cart")}
          onBrandClick={() => {
            setSearchTerm("");
            setActiveCategory("For You");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <CategoryBar
          isScrolled={isScrolled}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onBrandClick={() => {
            setSearchTerm("");
            setActiveCategory("For You");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      {/* Hero Section */}
      <section
        className="hero-section"
        onMouseEnter={() => setHeroSlide((currentSlide) => currentSlide)}
      >
        <div className="hero-viewport">
          <div
            className="hero-grid"
            style={{ "--hero-slide": heroSlide }}
          >
          {heroBanners.map((banner) => (
            <article
              className="hero-banner"
              key={banner.title}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="hero-banner-content">
                <p className="hero-small">{banner.eyebrow}</p>
                <h1>{banner.title}</h1>
                <p>{banner.detail}</p>
                <button onClick={() => {
                  setActiveCategory("For You");
                  showProducts();
                }}>
                  Shop Now
                </button>
              </div>
            </article>
            
            ))}
          </div>

          <button
            className="hero-arrow hero-arrow-left"
            type="button"
            aria-label="Previous banner"
            onClick={() => setHeroSlide((heroSlide + 3) % 4)}
          >
            &#8249;
          </button>
          <button
            className="hero-arrow hero-arrow-right"
            type="button"
            aria-label="Next banner"
            onClick={() => setHeroSlide((heroSlide + 1) % 4)}
          >
            &#8250;
          </button>
        </div>

        <div className="hero-dots" aria-label="Promotional banners">
          {heroBanners.map((banner, index) => (
            <button
              className={`hero-dot ${heroSlide === index ? "active" : ""}`}
              key={banner.title}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setHeroSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="ad-showcase" aria-label="Featured offers">
        <div className="ad-grid">
          {adCards.map((ad) => (
            <article className="ad-card" key={ad.title}>
              <div className="ad-card-media">
                <img src={ad.image} alt={ad.title} />
                <span className="ad-badge">AD</span>
              </div>
              <div className="ad-offer">{ad.offer}</div>
              <p>{ad.title}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Products */}
      <div ref={productsRef} className="product-results">
      <ProductSection
        title="Best Deals"
        products={visibleProducts}
        onViewAll={showProducts}
      />

      <ProductSection
        title="Trending Products"
        products={visibleProducts}
        onViewAll={showProducts}
      />

      <ProductSection
        title="Recommended For You"
        products={visibleProducts}
        onViewAll={showProducts}
      />
      </div>

      <Footer />

    </div>
  );
}

export default Home;