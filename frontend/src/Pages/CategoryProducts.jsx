import { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faMagnifyingGlass, faHeart as faHeartRegular, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InnerBanner from '../Components/InnerBanner';
import { getCategoryNameFromSlug } from '../data/categoryData';
import API from '../Admin/api';
import { useCart } from '../Admin/context/CartContext';
import { getImageUrl } from '../config';

gsap.registerPlugin(ScrollTrigger);

function CategoryProducts() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart } = useCart();
  const productsGridRef = useRef(null);
  const productCardsRef = useRef([]);
  const [products, setProducts] = useState([]);
    const categoryTitle = getCategoryNameFromSlug(slug);

    useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First get all categories to find the ID for this slug
        const catRes = await API.get('/categories');
        const category = catRes.data.find(c => c.slug === slug);
        
        if (category) {
          const res = await API.get(`/products?category_id=${category.id}`);
          setProducts(res.data.products || res.data || []);
        } else {
          // Fallback to all products if category not found
          const res = await API.get('/products');
          setProducts(res.data.products || res.data || []);
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
      }
    };
    fetchProducts();
  }, [slug]);

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    productCardsRef.current = productCardsRef.current.slice(0, products.length);
  }, [products.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(productCardsRef.current, {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: "back.out(0.4)",
        scrollTrigger: {
          trigger: productsGridRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    });

    return () => ctx.revert();
  }, [slug, products.length]);

  return (
    <>
      <Helmet>
        <title>{categoryTitle} | Jewelery For All Occasions</title>
        <meta name="description" content={`Browse ${categoryTitle} products at Jewelery For All Occasions.`} />
      </Helmet>
      <InnerBanner InnerBannerText={categoryTitle} />
      <section className="shop-sec category-products-sec">
        <div className="container">
          <div className="products-header category-products-header">
            <p>Showing {products.length} products in {categoryTitle}</p>
          </div>
          <div className="row products-row" ref={productsGridRef}>
            {products.map((product, idx) => (
              <div
                className="col-lg-3 col-md-4 col-sm-6"
                key={`${slug}-${product.id}`}
                ref={el => productCardsRef.current[idx] = el}
              >
                <div
                  className="shop-product-card"
                  onClick={() => goToProduct(product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="shop-product-image-wrapper">
                    <div className="shop-product-actions">
                      <div data-tooltip="Share"><FontAwesomeIcon icon={faShareNodes} /></div>
                      <div data-tooltip="Quick View"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                      <div data-tooltip="Add to Wishlist"><FontAwesomeIcon icon={faHeartRegular} /></div>
                    </div>
                    <div className="shop-product-image">
                      <img src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : ''} alt={product.name} />
                    </div>
                    <div className="shop-product-cart-btn">
                      <NavLink to="javascript:;" onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}>
                        <span className="cart-text">Add to Cart</span>
                        <span className="cart-icon"><FontAwesomeIcon icon={faCartShopping} /></span>
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
        </div>
      </section>
    </>
  );
}

export default CategoryProducts;
