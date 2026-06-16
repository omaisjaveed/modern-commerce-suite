import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShoppingBag, faHome } from '@fortawesome/free-solid-svg-icons';
import InnerBanner from '../Components/InnerBanner';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // If no orderId in state, redirect to home (prevent direct access)
    if (!orderId) {
      navigate('/');
      return;
    }
  }, [orderId, navigate]);

  return (
    <>
      <Helmet>
        <title>Order Success | Jewelery For All Occassions</title>
      </Helmet>
      <InnerBanner InnerBannerText="Order Confirmed" />

      <section className="order-success-sec py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="success-card p-5 bg-white rounded shadow-sm">
                <div className="success-icon mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#198754" />
                </div>
                <h2 className="mb-3" style={{ fontFamily: 'var(--heading-font)', fontWeight: '700' }}>Thank You For Your Order!</h2>
                <p className="lead text-muted mb-4">
                  Your order has been placed successfully.
                </p>
                
                <div className="order-info-box p-4 bg-light rounded mb-5">
                  <h5 className="mb-2">Order ID: <span className="text-primary">#{orderId}</span></h5>
                  <p className="mb-0 text-muted small">Please keep this ID for your records.</p>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link to="/shop" className="btn btn-dark px-4 py-3">
                    <FontAwesomeIcon icon={faShoppingBag} className="me-2" /> Continue Shopping
                  </Link>
                  <Link to="/" className="btn btn-outline-dark px-4 py-3">
                    <FontAwesomeIcon icon={faHome} className="me-2" /> Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .order-success-sec {
          background-color: #f5ebde;
          min-height: 60vh;
          display: flex;
          align-items: center;
        }
        .success-card {
          border: 1px solid rgba(20, 11, 7, 0.08);
          border-radius: 20px;
        }
        .success-icon {
          animation: scaleUp 0.5s ease-out;
        }
        .btn-dark {
          background-color: #140b07;
          border: none;
          font-family: var(--subheading-font);
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 10px;
          transition: 0.3s;
        }
        .btn-dark:hover {
          background-color: #242424;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .btn-outline-dark {
          border: 2px solid #140b07;
          color: #140b07;
          font-family: var(--subheading-font);
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 10px;
          font-weight: 600;
        }
        .btn-outline-dark:hover {
          background-color: #140b07;
          color: #fff;
        }
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default OrderSuccess;
