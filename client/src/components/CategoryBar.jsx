import "../styles/CategoryBar.css";

import allIcon from "../assets/caticon/all.svg";
import fashionIcon from "../assets/caticon/fashion.svg";
import mobilesIcon from "../assets/caticon/mobiles.svg";
import electronicsIcon from "../assets/caticon/electronics.svg";
import beautyIcon from "../assets/caticon/beauty.svg";
import homeIcon from "../assets/caticon/home-final.svg";
import tvIcon from "../assets/caticon/tv.svg";
import toyIcon from "../assets/caticon/toy.svg";
import foodIcon from "../assets/caticon/food.svg";
import autoIcon from "../assets/caticon/auto-new.svg";
import sportIcon from "../assets/caticon/sport.svg";
import furnitureIcon from "../assets/caticon/furniture.svg";
import booksIcon from "../assets/caticon/books.svg";
import autoAccIcon from "../assets/caticon/auto-acc.svg";

const categories = [
  {
    name: "For You",
    icon: allIcon,
  },
  {
    name: "Fashion",
    icon: fashionIcon,
  },
  {
    name: "Mobiles",
    icon: mobilesIcon,
  },
  {
    name: "Electronics",
    icon: electronicsIcon,
  },
  {
    name: "Beauty",
    icon: beautyIcon,
  },
  {
    name: "Home",
    icon: homeIcon,
  },
  {
    name: "Appliances",
    icon: tvIcon,
  },
  {
    name: "Toys, baby & kids",
    icon: toyIcon,
  },
  {
    name: "Food & Health",
    icon: foodIcon,
  },
  {
    name: "Auto Accessories",
    icon: autoAccIcon,
  },
  {
    name: "Sports & Fitness",
    icon: sportIcon,
  },
  {
    name: "Furniture",
    icon: furnitureIcon,
  },
  {
    name: "Books",
    icon: booksIcon,
  },
  {
    name: "2 Wheelers",
    icon: autoIcon,
  },
];

const CategoryBar = ({
  activeCategory,
  onCategoryChange,
  onBrandClick,
  isScrolled = false,
}) => {
  return (
    <section className={`category-bar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="category-container">

        {categories.map((category) => (
          <button
            className={`category-item ${activeCategory === category.name ? "active" : ""}`}
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
          >
            <div className="category-icon">
              <img src={category.icon} alt={category.name} />
            </div>

            <span>{category.name}</span>
          </button>
        ))}

      </div>
    </section>
  );
};

export default CategoryBar;