import { useEffect } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from './Pages/Home';
import './responsive.css';
import './App.css';
import AboutUs from './Pages/AboutUs';
import FaqsInner from './Pages/FAQs';
import ContactUs from './Pages/ContactUs';
import Terms from './Pages/Terms';
import LegalNotice from './Pages/LegalNotice';
import Auth from './Pages/Auth';
import Shop from './Pages/Shop';
import ProductDetail from './Pages/ProductDetail';
import AllCollections from './Pages/AllCollections';
import BlogDetail from './Pages/BlogDetail';
import Blogs from './Pages/Blogs';
import CategoryProducts from './Pages/CategoryProducts';
import BrandProducts from './Pages/BrandProducts';
import Checkout from './Pages/Checkout';
import Cart from './Pages/Cart';
import OrderSuccess from './Pages/OrderSuccess';

// Admin Imports
import AdminLayout from './Admin/layouts/AdminLayout';
import AdminDashboard from './Admin/pages/Dashboard';
import AdminProducts from './Admin/pages/Products';
import AdminDropShipping from './Admin/pages/DropShipping';
import AdminCategories from './Admin/pages/Categories';
import AdminBrands from './Admin/pages/Brands';
import AdminOrders from './Admin/pages/Orders';
import AdminInquiries from './Admin/pages/Inquiries';
import AdminMediaLibrary from './Admin/pages/MediaLibrary';
import AdminBlogs from './Admin/pages/Blogs';
import AdminReviews from './Admin/pages/Reviews';
import AdminProductReviews from './Admin/pages/ProductReviews';
import AdminFaqs from './Admin/pages/Faqs';
import AdminUsers from './Admin/pages/Users';
import AdminSettings from './Admin/pages/Settings';
import AdminLogin from './Admin/pages/Login';
import ProtectedRoute from './Admin/components/ProtectedRoute';
import { CartProvider } from './Admin/context/CartContext';

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {

  useEffect(() => {
    // Only initialize ScrollSmoother if not on admin routes
    if (!window.location.pathname.startsWith('/admin')) {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,   
        effects: true
      });

      return () => smoother.kill();
    }
  }, []);



  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="dropshipping" element={<AdminDropShipping />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="media" element={<AdminMediaLibrary />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="product-reviews" element={<AdminProductReviews />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="pages" element={<div>Pages Management</div>} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Frontend Routes */}
        <Route path="*" element={
          <div id="smooth-wrapper">
            <div id="smooth-content">
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/faqs" element={<FaqsInner />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/legal-notice" element={<LegalNotice />} />
                  <Route path="/login-signup" element={<Auth />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/category/:slug" element={<CategoryProducts />} />
                  <Route path="/brand/:slug" element={<BrandProducts />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/all-collections" element={<AllCollections />} />
                  <Route path="/blog" element={<Blogs />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                </Route>
              </Routes>
            </div>
          </div>
        } />
      </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
