import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Products from './Componets/Product';
import OrderComponent from './Componets/OrderComponent';
import CategoryProducts from './Componets/CategoryProducts';
import Cart from './Componets/Cart';
import Categories from './Componets/categories';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    phoneNumber: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getImageUrl = (relativePath) => {
    if (!relativePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    return `http://localhost:8080${relativePath}`;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const refreshOrders = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const placeOrder = async () => {
    setError(null);
    
    // Validate cart
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate customer info
    if (!customerInfo.customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validateEmail(customerInfo.customerEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!customerInfo.shippingAddress.trim()) {
      setError('Please enter your shipping address');
      return;
    }

    if (!validatePhone(customerInfo.phoneNumber)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setIsLoading(true);

    const orderData = {
      ...customerInfo,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: calculateCartTotal()
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const data = await response.json();
      
      // Reset on success
      setCart([]);
      setOrderSuccess(true);
      setCustomerInfo({
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        phoneNumber: ''
      });
      refreshOrders();
      
      setTimeout(() => {
        setOrderSuccess(false);
        setShowCart(false);
      }, 3000);
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="bg-gray-900 min-h-screen">
        <nav className="bg-gray-900 border-b border-gray-800 fixed w-full z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <NavLink to="/" className="flex-shrink-0 text-indigo-600 text-2xl font-bold">
                  The Zaffora
                </NavLink>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/categories', label: 'Categories' },
                  { to: '/products', label: 'Products' },
                  { to: '/orders', label: 'Orders' }
                ].map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <button 
                  onClick={() => setShowCart(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center ml-2"
                  disabled={cart.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-20 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products addToCart={addToCart} getImageUrl={getImageUrl} />} />
            <Route path="/orders" element={<OrderComponent refreshTrigger={refreshTrigger} />} />
            <Route path="/category-products/:categoryId" element={<CategoryProducts addToCart={addToCart} getImageUrl={getImageUrl} />} />
          </Routes>
        </div>

        <footer className="bg-gray-800 border-t border-gray-700 mt-10">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} KRM Enterprises. All rights reserved.
          </div>
        </footer>

        <Cart 
          cart={cart}
          showCart={showCart}
          setShowCart={setShowCart}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          orderSuccess={orderSuccess}
          setOrderSuccess={setOrderSuccess}
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
          calculateCartTotal={calculateCartTotal}
          placeOrder={placeOrder}
          getImageUrl={getImageUrl}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </Router>
  );
};

const Home = () => (
  <div className="text-center mt-10">
    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
      Welcome to <span className="text-indigo-500">The Zaffora</span>
    </h1>
    <p className="text-lg md:text-xl text-indigo-400 font-medium max-w-2xl mx-auto mb-4">
      A flagship product of <strong>KRM Enterprises</strong>
    </p>
    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
      Premium D2C solution for modern businesses
    </p>
    <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mb-6">
      Powered by <span className="text-indigo-400 font-bold">Zaffora</span> - India's premier D2C brand
    </p>
    
    <div className="flex justify-center gap-4 mb-12">
      <NavLink to="/categories" className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
        View Categories
      </NavLink>
      <NavLink to="/products" className="px-6 py-3 text-white bg-gray-700 hover:bg-gray-600 rounded-md">
        Browse Products
      </NavLink>
    </div>

    {/* About Section */}
    <div className="max-w-4xl mx-auto mb-12 bg-gray-800 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-white mb-6">About <span className="text-indigo-400">Zaffora</span></h2>
      <div className="text-left space-y-4">
        <p className="text-gray-300 leading-relaxed">
          <span className="text-indigo-400 font-bold">Zaffora</span> is a revolutionary D2C (Direct-to-Consumer) brand under KRM Enterprises, 
          dedicated to bringing premium quality products directly to your doorstep. We believe in cutting out the middleman 
          to provide you with the best value and authentic shopping experience.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Based in the heart of Tamil Nadu, India, we operate from Tenkasi, Kadayanallur, bringing you a curated selection 
          of products that meet the highest standards of quality and innovation. Our commitment to excellence drives us to 
          continuously evolve and adapt to your needs.
        </p>
        <p className="text-gray-300 leading-relaxed">
          At <span className="text-indigo-400 font-bold">Zaffora</span>, we're not just selling products - we're building 
          relationships, creating experiences, and fostering a community of satisfied customers who trust us for their 
          everyday needs and special occasions.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-indigo-400 font-bold mb-2">Quality First</h3>
            <p className="text-gray-300 text-sm">Every product is carefully selected and tested to ensure premium quality.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-indigo-400 font-bold mb-2">Direct to Consumer</h3>
            <p className="text-gray-300 text-sm">No middlemen, better prices, and authentic products delivered to you.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-indigo-400 font-bold mb-2">Local Pride</h3>
            <p className="text-gray-300 text-sm">Proudly serving from Tamil Nadu, supporting local communities.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Contact Section */}
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="text-left">
          <h3 className="text-xl font-bold text-white mb-4 ">Get in Touch</h3>
          <p className="text-gray-300 mb-6">
            Have questions about our products or need assistance? We're here to help! 
            Reach out to us through any of the following channels.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-300">+91-800-228-6261</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300">kishoreramm.dev@gmail.com</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-300"> Kadayanallur, Tenkasi , Tamil Nadu, India</span>
            </div>
          </div>
        </div>
        <div className="text-left">
          <h3 className="text-xl font-bold text-white mb-4 ml-16">Our Founder</h3>
          <div className="bg-gray-700 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-white mb-2">Kishore Ram M</h4>
            <p className="text-gray-300 text-sm mb-4">
              Visionary entrepreneur and founder of KRM Enterprises, driving innovation in the D2C space 
              with <span className="text-indigo-400 font-bold">Zaffora</span>.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300 text-sm">kishoreramm.dev@gmail.com</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300 text-sm">+91-800-228-6261</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <br /><br /><br />
  </div>
);

export default App;