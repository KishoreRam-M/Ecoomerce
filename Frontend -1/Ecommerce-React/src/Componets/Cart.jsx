import React, { useState } from 'react';

const Cart = ({ 
  cart, 
  showCart, 
  setShowCart, 
  customerInfo, 
  setCustomerInfo, 
  orderSuccess, 
  setOrderSuccess,
  removeFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  placeOrder,
  getImageUrl,
  clearCart
}) => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [orderError, setOrderError] = useState(null);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    
    Object.keys(customerInfo).forEach(key => {
      if (!validateField(key, customerInfo[key])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError(null);
    
    // Mark all fields as touched
    const allTouched = Object.keys(customerInfo).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    if (!validateForm()) {
      setOrderError('Please fill all required fields correctly');
      return;
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        customer: customerInfo,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl
        })),
        total: calculateCartTotal(),
        status: 'PENDING'
      };

      await placeOrder(orderData);
    } catch (error) {
      console.error('Order placement failed:', error);
      setOrderError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white">Your Shopping Cart</h3>
          <button 
            onClick={() => {
              setShowCart(false);
              setOrderSuccess(false);
            }}
            className="text-gray-400 hover:text-white"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {cart.length === 0 && !orderSuccess ? (
            <div className="text-center text-gray-400 py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p>Start adding products to your cart to place an order.</p>
            </div>
          ) : orderSuccess ? (
            <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-300">Thank you for your order. You'll receive a confirmation email shortly.</p>
              <button
                onClick={() => {
                  setShowCart(false);
                  setOrderSuccess(false);
                }}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {orderError && (
                <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">Order Failed</h3>
                  <p className="text-gray-300">{orderError}</p>
                </div>
              )}
              
              <div className="bg-gray-700 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {cart.map((item) => (
                      <tr key={item.product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                src={getImageUrl(item.product.imageUrl)} 
                                alt={item.product.name} 
                                className="h-full w-full object-cover rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                }}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-300">{item.product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${item.product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md"
                              aria-label="Increase quantity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${(item.product.price * item.quantity).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-400"
                            aria-label="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Customer Information</h4>
                <form onSubmit={handlePlaceOrder} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleCustomerInfoChange}
                        onBlur={handleBlur}
                        className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        onBlur={handleBlur}
                        className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                        onBlur={handleBlur}
                        className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleCustomerInfoChange}
                        onBlur={handleBlur}
                        className={`w-full bg-gray-800 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.address && touched.address && (
                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-xl font-bold text-white">
                      Total: ${calculateCartTotal().toFixed(2)}
                    </div>
                    <button
                      type="submit"
                      disabled={isPlacingOrder || cart.length === 0}
                      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md ${
                        isPlacingOrder || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;