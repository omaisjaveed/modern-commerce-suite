import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarRegular,
  faCartShopping,
  faHeart,
  faTruckFast,
  faArrowRotateLeft,
  faRulerCombined,
  faPlus,
  faMinus,
  faShieldAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import API from '../Admin/api';
import { useCart } from '../Admin/context/CartContext';
import Modal from '../Admin/components/Modal';
import { getImageUrl } from '../config';

gsap.registerPlugin(ScrollTrigger);

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [submittingNotify, setSubmittingNotify] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setReviewForm(prev => ({ ...prev, name: `${user.firstName} ${user.lastName}` }));
      setNotifyEmail(user.email || "");
    }
  }, []);

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    setSubmittingNotify(true);
    try {
      await API.post('/inquiries', {
        firstName: 'Stock',
        lastName: 'Notification',
        email: notifyEmail,
        phone: '',
        message: `Back in stock notification request for product: ${product.name} (ID: ${product.id})`
      });
      import('react-hot-toast').then(m => m.default.success('Thank you! We will notify you when this item is back in stock.'));
      setNotifyEmail("");
    } catch (error) {
      console.error('Error submitting notification request:', error);
      import('react-hot-toast').then(m => m.default.error('Failed to submit request.'));
    } finally {
      setSubmittingNotify(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/product-reviews/product/${id}?status=approved`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    setSubmittingReview(true);
    try {
      await API.post('/product-reviews', {
        product_id: id,
        user_id: user?.id || null,
        name: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      import('react-hot-toast').then(m => m.default.success('Review submitted! It will appear after approval.'));
      setReviewForm({ ...reviewForm, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      import('react-hot-toast').then(m => m.default.error('Failed to submit review.'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const metals = product?.metals ? product.metals.split(',').map(m => m.trim()) : [];
  const sizes = product?.sizes ? product.sizes.split(',').map(s => s.trim()) : [];

  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const tabsRef = useRef(null);
  const relatedRef = useRef(null);

  const handleAddToCart = () => {
    const productWithVariants = {
      ...product,
      selectedSize,
      selectedMetal
    };
    for(let i=0; i<quantity; i++) addToCart(productWithVariants);
    
    gsap.to(".cart-btn-pulse", {
      scale: 0.95,
      duration: 0.1,
      repeat: 2,
      yoyo: true,
    });
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = Math.max(0, 5 - full - (half ? 1 : 0));
    return (
      <>
        {[...Array(full)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} style={{ color: "#FFD700" }} />
        ))}
        {half && (
          <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: "#FFD700" }} />
        )}
        {[...Array(empty)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStarRegular}
            style={{ color: "#ccc" }}
          />
        ))}
      </>
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          const formattedImages = res.data.images.map(img => getImageUrl(img));
          setImages(formattedImages);
          setMainImage(formattedImages[0]);
        }
        // Set default selections
        if (res.data.sizes) {
          const sizeList = res.data.sizes.split(',').map(s => s.trim());
          if (sizeList.length > 0) setSelectedSize(sizeList[0]);
        }
        if (res.data.metals) {
          const metalList = res.data.metals.split(',').map(m => m.trim());
          if (metalList.length > 0) setSelectedMetal(metalList[0]);
        }

        // Fetch related products
        if (res.data.category_id) {
          const relatedRes = await API.get(`/products?category_id=${res.data.category_id}`);
          const relatedProductsList = relatedRes.data.products || relatedRes.data || [];
          setRelatedProducts(relatedProductsList.filter(p => p.id !== parseInt(id)).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          duration: 0.8,
          y: 40,
          opacity: 0,
          ease: "power2.out",
        });
      }

      if (infoRef.current) {
        gsap.from(infoRef.current, {
          duration: 0.8,
          x: 30,
          opacity: 0,
          ease: "back.out(0.4)",
          delay: 0.2,
        });
      }

      if (tabsRef.current) {
        gsap.from(tabsRef.current, {
          duration: 0.6,
          y: 30,
          opacity: 0,
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (relatedRef.current) {
        gsap.from(relatedRef.current, {
          duration: 0.6,
          y: 40,
          opacity: 0,
          scrollTrigger: {
            trigger: relatedRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [product]);

  if (loading) return <div className="container py-5 text-center">Loading product...</div>;
  if (!product) return <div className="container py-5 text-center">Product not found.</div>;

  return (
    <>
      <Helmet>
        <title>{product.name} | Jewelery For All Occasions</title>
      </Helmet>
      
      <section className="product-detail-sec py-5">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>

          <div className="product-main" ref={heroRef}>
            {/* Gallery */}
            <div className="product-gallery">
              <div className="vertical-thumbs-swiper">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  direction="vertical"
                  spaceBetween={16}
                  slidesPerView={5}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Thumbs]}
                  className="thumbs-swiper"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div
                        className={`thumb ${mainImage === img ? "active" : ""}`}
                        onClick={() => setMainImage(img)}
                      >
                        <img src={img} alt={`thumb ${idx}`} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="main-image">
                <Swiper
                  modules={[Thumbs]}
                  thumbs={{ swiper: thumbsSwiper }}
                  spaceBetween={0}
                  slidesPerView={1}
                  className="main-swiper"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={img} alt={`main ${idx}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="badge">Premium</div>
              </div>
            </div>

            {/* Info */}
            <div className="product-info" ref={infoRef}>
              <h1>{product.name}</h1>
              <div className="rating">
                {renderStars(4.8)} <span>({reviews.length} reviews)</span>
              </div>
              <div className="price">
                ${parseFloat(product.price).toFixed(2)}{" "}
                <span className="old-price">
                  <strike>${(parseFloat(product.price) * 1.2).toFixed(2)}</strike>
                </span>
              </div>

              <div className="stock-status mb-4">
                {product.stock_quantity > 0 ? (
                  <>
                    <span className="text-success fw-bold">
                      {product.stock_quantity} in stock
                    </span>
                  </>
                ) : (
                  <div className="out-of-stock-wrapper">
                    <span className="text-danger fw-bold d-block mb-2">Out of Stock</span>
                    <form onSubmit={handleNotifyMe} className="notify-form mt-3">
                      <div className="input-group">
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="Enter your email" 
                          value={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.value)}
                          required
                        />
                        <button 
                          type="submit" 
                          className="btn btn-dark"
                          disabled={submittingNotify}
                        >
                          {submittingNotify ? 'Submitting...' : 'Notify Me'}
                        </button>
                      </div>
                      <p className="text-muted small mt-2">
                        Leave your email address and we'll notify you as soon as this item is back in stock.
                      </p>
                    </form>
                  </div>
                )}
              </div>

              {product.stock_quantity > 0 && (
                <>
                  {metals.length > 0 && (
                    <div className="metal-options">
                      <p>Metal:</p>
                      <div className="swatches">
                        {metals.map((metal) => (
                          <button
                            key={metal}
                            className={`swatch ${selectedMetal === metal ? "active" : ""}`}
                            onClick={() => setSelectedMetal(metal)}
                          >
                            {metal}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {sizes.length > 0 && (
                    <div className="size-wrapper">
                      <p>
                        Size:{" "}
                        <button
                          className="size-guide"
                          onClick={() => setShowSizeChart(true)}
                        >
                          <FontAwesomeIcon icon={faRulerCombined} /> Size Chart
                        </button>
                      </p>
                      <div className="size-buttons">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`size-btn ${selectedSize === s ? "active" : ""}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="cart-area">
                    <div className="qty">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button className="cart-btn-pulse" onClick={handleAddToCart}>
                      <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
                    </button>
                  </div>
                </>
              )}

              <div className="trust">
                <div>
                  <FontAwesomeIcon icon={faTruckFast} /> Free Shipping
                </div>
                <div>
                  <FontAwesomeIcon icon={faArrowRotateLeft} /> 30 Days Return
                </div>
                <div>
                  <FontAwesomeIcon icon={faShieldAlt} /> 2 Year Warranty
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-section" ref={tabsRef}>
            <div className="tab-headers">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={activeTab === "info" ? "active" : ""}
                onClick={() => setActiveTab("info")}
              >
                Additional Info
              </button>
              <button
                className={activeTab === "shipping" ? "active" : ""}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping & Returns
              </button>
              <button
                className={activeTab === "reviews" ? "active" : ""}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({reviews.length})
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "description" && (
                <div className="tab-pane active" dangerouslySetInnerHTML={{ __html: product.description }} />
              )}
              {activeTab === "info" && (
                <div className="tab-pane active">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>SKU</td>
                        <td>{product.sku || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Category</td>
                        <td>{product.category_name}</td>
                      </tr>
                      <tr>
                        <td>Availability</td>
                        <td>{product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="tab-pane active">
                  <div className="shipping-returns-content">
                    <h5 className="mb-3">Shipping Policy</h5>
                    <p>We offer free standard shipping on all orders over $100. For orders under $100, a flat rate of $10 applies. All orders are processed within 1-2 business days.</p>
                    <ul className="mb-4">
                      <li>Standard Shipping: 3-5 business days</li>
                      <li>Express Shipping: 1-2 business days</li>
                      <li>International Shipping: 7-14 business days</li>
                    </ul>
                    <h5 className="mb-3">Return & Exchange Policy</h5>
                    <p>We want you to be completely satisfied with your purchase. If for any reason you are not happy, you can return your item(s) within 30 days of delivery for a full refund or exchange.</p>
                    <ul>
                      <li>Items must be in original condition and packaging.</li>
                      <li>Customized or engraved items are final sale.</li>
                      <li>Return shipping labels are provided for defective items.</li>
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="reviews-list">
                        {reviews.length > 0 ? (
                          reviews.map((rev) => (
                            <div key={rev.id} className="review-item">
                              <div className="review-header">
                                <strong>{rev.name}</strong>
                                <span className="stars">{renderStars(rev.rating)}</span>
                                <small>{new Date(rev.created_at).toLocaleDateString()}</small>
                              </div>
                              <p>{rev.comment}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No reviews yet. Be the first to review!</p>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="add-review-form p-4 bg-light rounded shadow-sm">
                        <h4 className="mb-4">Add a Review</h4>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-3">
                            <label className="form-label">Your Name</label>
                            <input 
                              type="text" 
                              name="name" 
                              className="form-control" 
                              value={reviewForm.name} 
                              onChange={handleReviewChange} 
                              required 
                              placeholder="Enter your name"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Rating</label>
                            <select 
                              name="rating" 
                              className="form-select" 
                              value={reviewForm.rating} 
                              onChange={handleReviewChange}
                            >
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Good</option>
                              <option value="3">3 - Average</option>
                              <option value="2">2 - Poor</option>
                              <option value="1">1 - Terrible</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Your Review</label>
                            <textarea 
                              name="comment" 
                              className="form-control" 
                              rows="4" 
                              value={reviewForm.comment} 
                              onChange={handleReviewChange} 
                              required 
                              placeholder="Write your review here..."
                            ></textarea>
                          </div>
                          <button 
                            type="submit" 
                            className="btn-primary w-100 py-3" 
                            disabled={submittingReview}
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products" ref={relatedRef}>
              <h2>You May Also Like</h2>
              <div className="row">
                {relatedProducts.map((p) => (
                  <div className="col-lg-3 col-md-4 col-6" key={p.id}>
                    <Link to={`/product/${p.id}`} className="related-card">
                      <img
                        src={
                          p.images && p.images.length > 0
                            ? getImageUrl(p.images[0])
                            : ""
                        }
                        alt={p.name}
                      />
                      <h4>{p.name}</h4>
                      <p>${parseFloat(p.price).toFixed(2)}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size Chart Modal */}
        <Modal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} title="Size Chart">
          <div className="size-chart-content p-2">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Size</th>
                  <th>Diameter (mm)</th>
                  <th>Circumference (mm)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>16.5</td><td>51.9</td></tr>
                <tr><td>M</td><td>17.3</td><td>54.4</td></tr>
                <tr><td>L</td><td>18.1</td><td>57.0</td></tr>
                <tr><td>XL</td><td>18.9</td><td>59.5</td></tr>
              </tbody>
            </table>
            <p className="text-muted small mt-3">
              * This is a general guide. For the most accurate measurement, we recommend visiting a local jeweler.
            </p>
          </div>
        </Modal>
      </section>
    </>
  );
}

export default ProductDetail;
