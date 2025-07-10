import React, { useEffect, useState } from 'react';

const OrderComponent = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:8080/api/orders';
        if (activeTab !== 'all') url += `?status=${activeTab}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, refreshTrigger]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
        {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map(status => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded ${
              activeTab === status ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-800 shadow rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-white">Order #{order.id}</h3>
                  <p className="text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="font-bold mt-1 text-white">${order.totalAmount?.toFixed(2)}</p>
                </div>
              </div>
              
              <button
                onClick={() => setOrderDetail(order)}
                className="mt-3 text-indigo-400 hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {orderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 p-4">
              <h3 className="text-xl font-bold text-white">Order #{orderDetail.id}</h3>
              <button 
                onClick={() => setOrderDetail(null)} 
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold text-white mb-2">Customer</h4>
                  <p className="text-gray-300">{orderDetail.customerName}</p>
                  <p className="text-gray-300">{orderDetail.customerEmail}</p>
                  <p className="text-gray-300">{orderDetail.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Shipping Info</h4>
                  <p className="text-gray-300">{orderDetail.shippingAddress}</p>
                  <p className="text-gray-300">Status: {orderDetail.status}</p>
                  <p className="text-gray-300">Total: ${orderDetail.totalAmount?.toFixed(2)}</p>
                </div>
              </div>

              <h4 className="font-bold text-white mb-2">Items</h4>
              <div className="border border-gray-700 rounded">
                {orderDetail.items?.map((item, i) => (
                  <div key={i} className="p-3 border-b border-gray-700 last:border-b-0 flex justify-between">
                    <div>
                      <p className="text-white">{item.productName || `Item ${i+1}`}</p>
                      <p className="text-sm text-gray-400">
                        ${item.price?.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderComponent;