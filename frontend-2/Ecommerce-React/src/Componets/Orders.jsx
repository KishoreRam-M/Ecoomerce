// src/components/Orders.js
import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext'; // Assuming you have a CartContext

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, clearCart } = useCart(); // Get cart items and clear function

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new order from cart items
  const createOrder = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        })),
        totalAmount: cartItems.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        ),
        status: 'PENDING'
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.status}`);
      }

      const newOrder = await response.json();
      setOrders(prev => [newOrder, ...prev]);
      clearCart(); // Clear the cart after successful order
      return newOrder;
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 alert alert-danger">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders</h2>
        <button 
          onClick={createOrder}
          disabled={!cartItems || cartItems.length === 0}
          className="btn btn-primary"
        >
          Create Order from Cart
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found. Add items to your cart and create an order.
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between">
                  <h5 className="mb-0">Order #{order.id}</h5>
                  <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="card-text">
                    <strong>Total:</strong> ${order.totalAmount?.toFixed(2)}
                  </p>
                  <h6 className="mt-3">Items:</h6>
                  <ul className="list-group list-group-flush">
                    {order.items?.map((item, index) => (
                      <li key={index} className="list-group-item">
                        {item.productName || `Product ${item.productId}`} - 
                        {item.quantity} × ${item.priceAtPurchase?.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function for status badge colors
function getStatusBadgeColor(status) {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'PROCESSING': return 'info';
    case 'SHIPPED': return 'primary';
    case 'DELIVERED': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'secondary';
  }
}

export default Orders;