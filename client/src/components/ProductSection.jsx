import ProductCard from "./ProductCard";
import "../styles/ProductSection.css";

const ProductSection = ({
  title,
  products,
  onViewAll,
}) => {
  return (
    <section className="product-section">

      <div className="section-header">
        <h2>{title}</h2>

        <button onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="products-container">

        {products.length > 0 ? products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        )) : <p className="empty-products">No products found in this category.</p>}

      </div>

    </section>
  );
};

export default ProductSection;