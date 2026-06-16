import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faMagnifyingGlass,
  faHeart as faHeartRegular,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InnerBanner from "../Components/InnerBanner";
import { NavLink } from "react-router-dom";
import API from "../Admin/api";
import { useCart } from "../Admin/context/CartContext";
import { getImageUrl } from "../config";

gsap.registerPlugin(ScrollTrigger);

function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [],
    metals: [],
    gemstones: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
        ]);
        setProducts(prodRes.data.products || prodRes.data || []);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterSidebarRef = useRef(null);
  const productsGridRef = useRef(null);
  const productCardsRef = useRef([]);

  // Navigation handler
  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handlePriceChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange.includes(range)
        ? prev.priceRange.filter((r) => r !== range)
        : [...prev.priceRange, range],
    }));
  };

  const handleMetalChange = (metal) => {
    setFilters((prev) => ({
      ...prev,
      metals: prev.metals.includes(metal)
        ? prev.metals.filter((m) => m !== metal)
        : [...prev.metals, metal],
    }));
  };

  const handleGemstoneChange = (gemstone) => {
    setFilters((prev) => ({
      ...prev,
      gemstones: prev.gemstones.includes(gemstone)
        ? prev.gemstones.filter((g) => g !== gemstone)
        : [...prev.gemstones, gemstone],
    }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], priceRange: [], metals: [], gemstones: [] });
  };

  const filterProducts = () => {
    return products.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category_name)
      )
        return false;
      if (filters.priceRange.length > 0) {
        let priceMatch = false;
        const price = parseFloat(product.price);
        if (filters.priceRange.includes("under100") && price < 100)
          priceMatch = true;
        if (
          filters.priceRange.includes("100to500") &&
          price >= 100 &&
          price <= 500
        )
          priceMatch = true;
        if (filters.priceRange.includes("above500") && price > 500)
          priceMatch = true;
        if (!priceMatch) return false;
      }
      // For now, metal and gemstone are static or can be added to DB as attributes later
      return true;
    });
  };

  const filteredProducts = filterProducts();

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (filterSidebarRef.current) {
        gsap.from(filterSidebarRef.current, {
          duration: 0.8,
          y: 40,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: filterSidebarRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const productCards = productCardsRef.current.filter(Boolean);

      if (productCards.length > 0 && productsGridRef.current) {
        gsap.from(productCards, {
          duration: 0.6,
          y: 30,
          opacity: 0,
          stagger: 0.08,
          ease: "back.out(0.4)",
          scrollTrigger: {
            trigger: productsGridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => ctx.revert();
  }, [filteredProducts]);

  useEffect(() => {
    productCardsRef.current = productCardsRef.current.slice(
      0,
      filteredProducts.length,
    );
  }, [filteredProducts]);

  return (
    <>
      <Helmet>
        <title>Shop | Jewelery For All Occasions</title>
        <meta
          name="description"
          content="Browse our stunning collection of fine jewelry for every occasion."
        />
      </Helmet>
      <InnerBanner InnerBannerText="Shop" />
      <section className="shop-sec">
        <div className="container">
          <div className="row">
            {/* Filter Sidebar */}
            <div className="col-lg-4 col-md-12" ref={filterSidebarRef}>
              <div className="filter-sidebar">
                <div className="filter-header">
                  <h3>Filters</h3>
                  <button className="clear-filters" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>
                <div className="filter-group">
                  <h4>Categories</h4>
                  {categories.map((cat) => (
                    <label key={cat.id}>
                      <input
                        type="checkbox"
                        onChange={() => handleCategoryChange(cat.name)}
                        checked={filters.categories.includes(cat.name)}
                      />{" "}
                      {cat.name}
                    </label>
                  ))}
                </div>
                <div className="filter-group">
                  <h4>Price Range</h4>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceChange("under100")}
                      checked={filters.priceRange.includes("under100")}
                    />{" "}
                    Under $100
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceChange("100to500")}
                      checked={filters.priceRange.includes("100to500")}
                    />{" "}
                    $100 - $500
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceChange("above500")}
                      checked={filters.priceRange.includes("above500")}
                    />{" "}
                    Above $500
                  </label>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-8 col-md-12" ref={productsGridRef}>
              <div className="products-header">
                <p>
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>
              <div className="row products-row">
                {filteredProducts.map((product, idx) => (
                  <div
                    className="col-lg-4 col-md-6 col-sm-6"
                    key={product.id}
                    ref={(el) => (productCardsRef.current[idx] = el)}
                  >
                    {/* Product Card with onClick */}
                    <div
                      className="shop-product-card"
                      onClick={() => goToProduct(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="shop-product-image-wrapper">
                        <div className="shop-product-actions">
                          <div data-tooltip="Share">
                            <FontAwesomeIcon icon={faShareNodes} />
                          </div>
                          <div data-tooltip="Quick View">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </div>
                          {/* <div data-tooltip="Add to Wishlist">
                            <FontAwesomeIcon icon={faHeartRegular} />
                          </div> */}
                        </div>
                        <div className="shop-product-image">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? getImageUrl(product.images[0])
                                : ""
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="shop-product-cart-btn">
                          <NavLink
                            to="javascript:;"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            <span className="cart-text">Add to Cart</span>
                            <span className="cart-icon">
                              <FontAwesomeIcon icon={faCartShopping} />
                            </span>
                          </NavLink>
                        </div>
                      </div>
                      <div className="shop-product-info">
                        <div className="shop-product-title">
                          <h3>{product.name}</h3>
                        </div>
                        <div className="shop-product-category">
                          <h5>{product.category_name}</h5>
                        </div>
                        <div className="shop-product-price">
                          <p>${parseFloat(product.price).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && !loading && (
                <div className="no-products">
                  No products match your filters. Try clearing some filters.
                </div>
              )}
              {loading && <div className="loading">Loading products...</div>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Shop;
