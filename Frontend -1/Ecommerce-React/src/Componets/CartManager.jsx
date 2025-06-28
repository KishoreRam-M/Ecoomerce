import React, { useState } from 'react';
import Cart from './Cart';

const CartManager = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Add to cart or increment quantity
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Update product quantity
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

  // Calculate total cart value
  const calculateCartTotal = () => {
    return cart.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  };

  // Clear cart and reset customer info
  const clearCart = () => {
    setCart([]);
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  // Submit order to backend
  const placeOrder = async (orderData) => {
    try {
      // Validate order data
      if (!orderData.customer || !orderData.items || orderData.items.length === 0) {
        throw new Error('Invalid order data - cart is empty or customer info missing');
      }

      // Prepare the order payload
      const payload = {
        customer: {
          name: orderData.customer.name.trim(),
          email: orderData.customer.email.trim(),
          phone: orderData.customer.phone.trim(),
          address: orderData.customer.address.trim()
        },
        items: orderData.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl
        })),
        total: orderData.total,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Order failed with status ${response.status}`
        );
      }

      const result = await response.json();
      setOrderSuccess(true);
      clearCart();
      return result;
    } catch (error) {
      console.error('Order placement error:', error);
      throw error;
    }
  };

  // Handle image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=No+Image';
    return imagePath.startsWith('http') ? imagePath : `/images/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Sample Product Listing */}
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
      </button>

      {/* Cart Component */}
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
        clearCart={clearCart}
      />
    </div>
  );
};

export default CartManager;