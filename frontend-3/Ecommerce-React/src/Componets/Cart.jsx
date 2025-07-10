import React from 'react';

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
  isLoading,
  error,
  setError
}) => {
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white">Your Shopping Cart</h3>
          <button 
            onClick={() => {
              setShowCart(false);
              setOrderSuccess(false);
            }}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {orderSuccess ? (
            <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">Order Placed Successfully!</h3>
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
              {error && (
                <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">Order Failed</h3>
                  <p className="text-gray-300">{error}</p>
                </div>
              )}
              
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p>Start adding products to your cart to place an order.</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-700 rounded-lg overflow-hidden mb-6">
                    <table className="min-w-full divide-y divide-gray-600">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3"></th>
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
                                >
                                  -
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                                  className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${(item.product.price * item.quantity).toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button 
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-400"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          name="customerName"
                          value={customerInfo.customerName}
                          onChange={handleCustomerInfoChange}
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="customerEmail"
                          name="customerEmail"
                          value={customerInfo.customerEmail}
                          onChange={handleCustomerInfoChange}
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={customerInfo.phoneNumber}
                          onChange={handleCustomerInfoChange}
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-300 mb-1">
                          Shipping Address *
                        </label>
                        <input
                          type="text"
                          id="shippingAddress"
                          name="shippingAddress"
                          value={customerInfo.shippingAddress}
                          onChange={handleCustomerInfoChange}
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-xl font-bold text-white">
                        Total: ${calculateCartTotal().toFixed(2)}
                      </div>
                      <button
                        onClick={placeOrder}
                        disabled={isLoading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;