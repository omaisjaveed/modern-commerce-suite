import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import InnerBanner from '../Components/InnerBanner';
import { NavLink, useNavigate } from "react-router-dom";
import API from '../api';
import toast from 'react-hot-toast';

function Auth() {
  const [activeTab, setActiveTab] = useState('signup'); // 'login' or 'signup'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
    newsletter: false
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // Password strength & requirements
  const [passwordStrength, setPasswordStrength] = useState(''); // weak, medium, strong
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkPasswordStrength = (pwd) => {
    const length = pwd.length >= 8;
    const uppercase = /[A-Z]/.test(pwd);
    const lowercase = /[a-z]/.test(pwd);
    const number = /[0-9]/.test(pwd);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const reqs = { length, uppercase, lowercase, number, special };
    setRequirements(reqs);
    const strengthCount = Object.values(reqs).filter(Boolean).length;
    if (pwd.length === 0) setPasswordStrength('');
    else if (strengthCount <= 2) setPasswordStrength('weak');
    else if (strengthCount <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSignupData({ ...signupData, [name]: checked });
    } else {
      setSignupData({ ...signupData, [name]: value });
      if (name === 'password') checkPasswordStrength(value);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Logging in...');
    try {
      const res = await API.post('/auth/login', loginData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success('Login successful!', { id: loadingToast });
      
      // Update header state immediately by triggering storage event
      window.dispatchEvent(new Event('storage'));
      
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', { id: loadingToast });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (!signupData.terms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating account...');
    try {
      const res = await API.post('/auth/register', {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success('Account created successfully!', { id: loadingToast });
      
      // Update header state immediately by triggering storage event
      window.dispatchEvent(new Event('storage'));
      
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed', { id: loadingToast });
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login / Sign Up | Jewelery For All Occassions</title>
        <meta name="description" content="Login or create an account to explore our exclusive jewelry collection." />
      </Helmet>

      <InnerBanner InnerBannerText="Login / SignUp" />

      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-sm-12">
              <div className="signup-wrapper">
                {/* Tabs */}
                <div className="auth-tabs">
                  <button
                    className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form className="signup-form" onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label><i className="fa-regular fa-envelope"></i> Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><i className="fa-solid fa-lock"></i> Password *</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          className="form-control"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          required
                        />
                        <span
                          className="password-toggle"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          <i className={`fa-regular ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                      </div>
                    </div>
                    <div className="form-footer">
                      <label className="checkbox-container">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">Remember me</span>
                      </label>
                      <a href="#" className="forgot-link">Forgot password?</a>
                    </div>
                    <button type="submit" className="signup-btn shine-btn" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login Now'}
                    </button>
                  </form>
                )}

                {/* Signup Form - exact same as HTML given */}
                {activeTab === 'signup' && (
                  <form className="signup-form" onSubmit={handleSignupSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label><i className="fa-regular fa-user"></i> First Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={signupData.firstName}
                            onChange={handleSignupChange}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label><i className="fa-regular fa-user"></i> Last Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={signupData.lastName}
                            onChange={handleSignupChange}
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label><i className="fa-regular fa-envelope"></i> Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label><i className="fa-solid fa-phone"></i> Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        placeholder="Enter your phone number (optional)"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label><i className="fa-solid fa-lock"></i> Password *</label>
                          <div className="password-input-wrapper">
                            <input
                              type={showSignupPassword ? "text" : "password"}
                              className="form-control"
                              name="password"
                              value={signupData.password}
                              onChange={handleSignupChange}
                              placeholder="Create password"
                              required
                            />
                            <span
                              className="password-toggle"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                            >
                              <i className={`fa-regular ${showSignupPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                          </div>
                          <div className="password-strength">
                            <div className={`strength-bar ${passwordStrength === 'weak' ? 'weak' : ''}`}></div>
                            <div className={`strength-bar ${passwordStrength === 'medium' ? 'medium' : passwordStrength === 'strong' ? 'strong' : ''}`}></div>
                            <div className={`strength-bar ${passwordStrength === 'strong' ? 'strong' : ''}`}></div>
                            <span className="strength-text">
                              {passwordStrength === 'weak' && 'Weak'}
                              {passwordStrength === 'medium' && 'Medium'}
                              {passwordStrength === 'strong' && 'Strong'}
                              {!passwordStrength && 'Password strength'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label><i className="fa-solid fa-lock"></i> Confirm Password *</label>
                          <div className="password-input-wrapper">
                            <input
                              type={showSignupConfirm ? "text" : "password"}
                              className="form-control"
                              name="confirmPassword"
                              value={signupData.confirmPassword}
                              onChange={handleSignupChange}
                              placeholder="Confirm password"
                              required
                            />
                            <span
                              className="password-toggle"
                              onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                            >
                              <i className={`fa-regular ${showSignupConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="password-requirements">
                      <p>Password must contain:</p>
                      <ul>
                        <li className={`req-item ${requirements.length ? 'valid' : ''}`}>
                          <i className="fa-regular fa-circle-check"></i> At least 8 characters
                        </li>
                        <li className={`req-item ${requirements.uppercase ? 'valid' : ''}`}>
                          <i className="fa-regular fa-circle-check"></i> At least one uppercase letter
                        </li>
                        <li className={`req-item ${requirements.lowercase ? 'valid' : ''}`}>
                          <i className="fa-regular fa-circle-check"></i> At least one lowercase letter
                        </li>
                        <li className={`req-item ${requirements.number ? 'valid' : ''}`}>
                          <i className="fa-regular fa-circle-check"></i> At least one number
                        </li>
                        <li className={`req-item ${requirements.special ? 'valid' : ''}`}>
                          <i className="fa-regular fa-circle-check"></i> At least one special character
                        </li>
                      </ul>
                    </div>

                    <div className="terms-checkbox">
                      <label className="checkbox-container">
                        <input type="checkbox" name="terms" checked={signupData.terms} onChange={handleSignupChange} required />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">
                          I agree to the <NavLink to='/terms' className="terms-link">Terms &amp; Conditions</NavLink> and <NavLink to="/legal-notice" className="terms-link">Legal Notice</NavLink> *
                        </span>
                      </label>
                    </div>

                    <div className="terms-checkbox">
                      <label className="checkbox-container">
                        <input type="checkbox" name="newsletter" checked={signupData.newsletter} onChange={handleSignupChange} />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">I want to receive newsletters and promotional offers</span>
                      </label>
                    </div>

                    <button type="submit" className="signup-btn shine-btn" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'} <i className="fa-solid fa-arrow-right"></i>
                    </button>

                    <div className="login-link">
                      Already have an account? <a href="#" onClick={() => setActiveTab('login')}>Login here</a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add FontAwesome for icons - if not already in project */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </>
  );
}

export default Auth;