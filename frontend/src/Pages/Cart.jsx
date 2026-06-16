import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../Admin/context/CartContext';
import InnerBanner from '../Components/InnerBanner';
import { getImageUrl } from '../config';

function Cart() {
  const { cartItems, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Shopping Cart | Jewelry For All Occasions</title>
      </Helmet>
      
      <InnerBanner InnerBannerText="Shopping Cart" />

      <section className="cart-page py-5" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '5rem', color: '#e0e0e0' }} />
              </div>
              <h2 className="mb-3" style={{ fontFamily: 'var(--heading-font)' }}>Your cart is empty</h2>
              <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/shop" className="btn btn-dark px-5 py-3 rounded-pill text-uppercase letter-spacing-1">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="cart-items-wrapper bg-white rounded shadow-sm overflow-hidden">
                  <table className="table mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="p-4 border-0">Product</th>
                        <th className="p-4 border-0">Price</th>
                        <th className="p-4 border-0">Quantity</th>
                        <th className="p-4 border-0 text-end">Subtotal</th>
                        <th className="p-4 border-0"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, idx) => (
                        <tr key={`${item.id}-${idx}`}>
                          <td className="p-4 border-bottom">
                            <div className="d-flex align-items-center gap-3">
                              <img 
                                src={item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : ''} 
                                alt={item.name} 
                                className="img-fluid rounded" 
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                              />
                              <div>
                                <h6 className="mb-1 fw-bold">{item.name}</h6>
                                <div className="text-muted small">
                                  {item.selectedSize && <span className="me-2">Size: {item.selectedSize}</span>}
                                  {item.selectedMetal && <span>Metal: {item.selectedMetal}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 border-bottom">${parseFloat(item.price).toFixed(2)}</td>
                          <td className="p-4 border-bottom">
                            <div className="quantity-control d-inline-flex align-items-center border rounded bg-light">
                              <button 
                                className="btn btn-sm px-3" 
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedMetal)}
                              >
                                <FontAwesomeIcon icon={faMinus} size="xs" />
                              </button>
                              <span className="px-2 fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                              <button 
                                className="btn btn-sm px-3" 
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedMetal)}
                              >
                                <FontAwesomeIcon icon={faPlus} size="xs" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 border-bottom text-end fw-bold">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-4 border-bottom text-end">
                            <button 
                              className="btn btn-link text-danger p-0" 
                              onClick={() => removeItem(item.id, item.selectedSize, item.selectedMetal)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-light">
                    <Link to="/shop" className="text-dark text-decoration-none fw-bold small text-uppercase letter-spacing-1">
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="cart-summary-card p-4 bg-white rounded shadow-sm border">
                  <h4 className="mb-4" style={{ fontFamily: 'var(--heading-font)' }}>Order Summary</h4>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success fw-bold">Free</span>
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-between mb-4 h4 fw-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn btn-dark w-100 py-3 rounded-pill text-uppercase letter-spacing-1 fw-bold"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </button>
                  <div className="mt-4 text-center">
                    <img src="https://help.zazzle.com/hc/article_attachments/360010513393/Logos-01.png" alt="Payment Methods" className="img-fluid" style={{ opacity: 0.8, maxWidth: '200px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .cart-page .table > :not(caption) > * > * {
          padding: 1.5rem 1rem;
        }
        .letter-spacing-1 { letter-spacing: 1px; }
        .cart-summary-card {
          position: sticky;
          top: 100px;
        }
        .btn-dark {
          background-color: #140b07;
          border-color: #140b07;
          transition: all 0.3s;
        }
        .btn-dark:hover {
          background-color: #2a1b15;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `}} />
    </>
  );
}

export default Cart;
