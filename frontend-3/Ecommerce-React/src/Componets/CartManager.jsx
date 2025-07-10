import React, { useState } from 'react';
import Cart from './Cart';
import OrderComponent from './OrderComponent';

const CartManager = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    phoneNumber: '',
    shippingAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Force OrderComponent refresh
  const refreshOrders = () => setRefreshTrigger(prev => prev + 1);

  // Add product to cart or increment quantity if already exists
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      return existingItem 
        ? prevCart.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...prevCart, { product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Update quantity of a specific product in cart
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Calculate total price of all items in cart
  const calculateCartTotal = () => 
    cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Clear cart and reset customer info
  const clearCart = () => {
    setCart([]);
    setCustomerInfo({ 
      customerName: '', 
      customerEmail: '', 
      phoneNumber: '', 
      shippingAddress: '' 
    });
  };

  // Validate customer information
  const validateCustomerInfo = () => {
    if (!customerInfo.customerName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!customerInfo.customerEmail.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(customerInfo.customerEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!customerInfo.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!customerInfo.shippingAddress.trim()) {
      setError('Please enter your shipping address');
      return false;
    }
    return true;
  };

  // Place order with current cart items and customer info
  const placeOrder = async () => {
    setError(null);
    
    // Validate cart has items
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate customer info
    if (!validateCustomerInfo()) {
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        customerName: customerInfo.customerName.trim(),
        customerEmail: customerInfo.customerEmail.trim(),
        phoneNumber: customerInfo.phoneNumber.trim(),
        shippingAddress: customerInfo.shippingAddress.trim(),
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl
        })),
        totalAmount: calculateCartTotal(),
        status: 'PENDING'
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Order failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Clear cart and show success
      setOrderSuccess(true);
      clearCart();
      refreshOrders();
      
      return data;
    } catch (error) {
      console.error('Order error:', error);
      setError(error.message || 'Failed to place order. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simple image URL handler
  const getImageUrl = (url) => url;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Product Listing */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(id => (
          <div key={id} className="bg-white rounded-lg shadow-md p-4">
            <img 
              src={`https://picsum.photos/300/200?random=${id}`} 
              alt={`Product ${id}`} 
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-xl font-semibold mb-2">Product {id}</h3>
            <p className="text-gray-600 mb-2">${(19.99 * id).toFixed(2)}</p>
            <button
              onClick={() => addToCart({
                id,
                name: `Product ${id}`,
                price: 19.99 * id,
                imageUrl: `https://picsum.photos/300/200?random=${id}`
              })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        aria-label="Open cart"
      >
        🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
      </button>

      {/* Cart Modal */}
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
        setError={setError}
      />

      {/* Orders List */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
        <OrderComponent refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default CartManager;