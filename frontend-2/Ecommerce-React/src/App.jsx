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
                  KRM House
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
      Welcome to <span className="text-indigo-500">KrmHouse Admin</span>
    </h1>
    <p className="text-lg md:text-xl text-indigo-400 font-medium max-w-2xl mx-auto mb-4">
      A flagship product of <strong>KRM Enterprises</strong>
    </p>
    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
      Premium e-commerce solution for modern businesses
    </p>
    <br />
    <div className="flex justify-center gap-4">
      <NavLink to="/categories" className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
        View Categories
      </NavLink>
      <NavLink to="/products" className="px-6 py-3 text-white bg-gray-700 hover:bg-gray-600 rounded-md">
        Browse Products
      </NavLink>
    </div>
    <br /><br /><br /><br /><br /><br /><br /><br /><br />
  </div>
);

export default App;