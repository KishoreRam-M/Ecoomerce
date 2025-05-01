// src/components/Orders.js
import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Orders</h2>
      <div className="row">
        {orders.map((order) => (
          <div className="col-md-4 mb-3" key={order.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order ID: {order.id}</h5>
                <p className="card-text">Customer: {order.customerName}</p>
                <p className="card-text">Status: {order.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
