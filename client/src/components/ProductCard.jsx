import {
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";

import "../styles/productcard.css";
import { useShop } from "../context/useShop";

const ProductCard = ({ product }) => {
  const { cart, wishlist, addToCart, toggleWishlist } = useShop();
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const cartItem = cart.find((item) => item.id === product.id);

  return (
    <article className="product-card">

      <button
        className={`wishlist-button ${isWishlisted ? "active" : ""}`}
        aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${isWishlisted ? "from" : "to"} wishlist`}
        onClick={() => toggleWishlist(product)}
      >
        <FiHeart />
      </button>

      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">

        <h3 className="product-name">
          {product.name}
        </h3>

        <div className="product-rating">
          <span>{product.rating} ★</span>
          <small>{product.reviews} Reviews</small>
        </div>

        <div className="product-price">
          <strong>₹{product.price.toLocaleString()}</strong>

          <span className="product-mrp">
            ₹{product.mrp.toLocaleString()}
          </span>

          <span className="product-discount">
            {product.discount}% off
          </span>
        </div>

        <button className="add-cart-button" onClick={() => addToCart(product)}>
          <FiShoppingCart />
          {cartItem ? `In Cart (${cartItem.quantity})` : "Add to Cart"}
        </button>

      </div>

    </article>
  );
};

export default ProductCard;