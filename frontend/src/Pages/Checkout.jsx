import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useCart } from '../Admin/context/CartContext';
import InnerBanner from '../Components/InnerBanner';
import { useNavigate } from 'react-router-dom';
import API from '../Admin/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

// Internal component to capture Stripe hooks - MOVED OUTSIDE to prevent re-creation on every render
const CheckoutFormContent = ({ handleSubmit, formData, handleChange, cartItems, totalPrice, loading, stripePromise, stripe, elements }) => {
  return (
    <form onSubmit={(e) => handleSubmit(e, stripe, elements)}>
      <div className="row">
        <div className="col-lg-7">
          <div className="checkout-card p-4 bg-white rounded shadow-sm">
            <h4 className="mb-4" style={{ fontFamily: 'var(--heading-font)' }}>Billing Details</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input type="text" name="firstName" className="form-control" value={formData.firstName} required onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" name="lastName" className="form-control" value={formData.lastName} required onChange={handleChange} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" value={formData.email} required onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} required onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Shipping Address</label>
              <textarea name="address" className="form-control" rows="3" value={formData.address} required onChange={handleChange}></textarea>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-control" value={formData.city} required onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Zip Code</label>
                <input type="text" name="zipCode" className="form-control" value={formData.zipCode} required onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="checkout-card p-4 bg-white rounded shadow-sm sticky-top" style={{ top: '100px' }}>
            <h4 className="mb-4" style={{ fontFamily: 'var(--heading-font)' }}>Order Summary</h4>
            <div className="order-items mb-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold h5">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <h4 className="mb-3" style={{ fontFamily: 'var(--heading-font)' }}>Payment Method</h4>
            <div className="payment-methods mb-4">
              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="paymentMethod" value="cod" id="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
              </div>
              
              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="paymentMethod" value="stripe" id="stripe" checked={formData.paymentMethod === 'stripe'} disabled={!stripePromise} onChange={handleChange} />
                <label className="form-check-label" htmlFor="stripe">
                  Credit Card (Stripe) {!stripePromise && <small className="text-muted">(Loading...)</small>}
                </label>
              </div>
              
              {formData.paymentMethod === 'stripe' && stripePromise && (
                <div className="stripe-card-container mt-3 p-3 border rounded bg-light">
                  <label className="form-label small fw-bold mb-2">Card Information</label>
                  <div className="p-3 bg-white border rounded">
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#9e2146' },
                      },
                    }} />
                  </div>
                </div>
              )}

              <div className="form-check mt-2">
                <input className="form-check-input" type="radio" name="paymentMethod" value="paypal" id="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} />
                <label className="form-check-label" htmlFor="paypal">PayPal</label>
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-3" disabled={loading || cartItems.length === 0}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const StripeHooksWrapper = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  return <CheckoutFormContent {...props} stripe={stripe} elements={elements} />;
};

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [stripeKey, setStripeKey] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);

  // Initialize stripePromise only when stripeKey is available
  const stripePromise = React.useMemo(() => {
    if (stripeKey) {
      return loadStripe(stripeKey);
    }
    return null;
  }, [stripeKey]);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const res = await API.get('/settings/payment');
        if (res.data && res.data.stripePublicKey) {
          setStripeKey(res.data.stripePublicKey);
        }
      } catch (error) {
        console.error('Error fetching stripe key:', error);
      }
    };
    fetchStripeKey();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, stripe, elements) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);

    try {
      let paymentId = null;

      if (formData.paymentMethod === 'stripe') {
        if (!stripe || !elements) {
          toast.error('Stripe is not ready');
          setLoading(false);
          return;
        }

        const { data: { clientSecret } } = await API.post('/orders/create-payment-intent', {
          amount: totalPrice
        });

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
            }
          }
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        if (paymentIntent.status === 'succeeded') {
          paymentId = paymentIntent.id;
        }
      }

      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        paymentId: paymentId
      };

      const res = await API.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | Jewelery For All Occassions</title>
      </Helmet>
      <InnerBanner InnerBannerText="Checkout" />
      
      <section className="checkout-sec py-5" style={{ backgroundColor: '#f5ebde' }}>
        <div className="container">
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <StripeHooksWrapper 
                handleSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
                cartItems={cartItems}
                totalPrice={totalPrice}
                loading={loading}
                stripePromise={stripePromise}
              />
            </Elements>
          ) : (
            <CheckoutFormContent 
              handleSubmit={handleSubmit}
              formData={formData}
              handleChange={handleChange}
              cartItems={cartItems}
              totalPrice={totalPrice}
              loading={loading}
              stripePromise={null}
              stripe={null}
              elements={null}
            />
          )}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-card {
          border: 1px solid rgba(20, 11, 7, 0.08);
        }
        .form-control {
          background-color: #fcf9f5;
          border: 1px solid #ddd;
          padding: 0.75rem;
        }
        .form-control:focus {
          background-color: #fff;
          border-color: #140b07;
          box-shadow: none;
        }
        .btn-dark {
          background-color: #140b07;
          border: none;
          font-family: var(--subheading-font);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .btn-dark:hover {
          background-color: #242424;
        }
      `}} />
    </>
  );
}

export default Checkout;

