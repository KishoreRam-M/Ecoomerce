import React, { useEffect, useState } from 'react';

const OrderComponent = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [orderDetail, setOrderDetail] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchOrders();
  }, [activeTab, refreshTrigger]);

  const fetchOrders = () => {
    let url = 'http://localhost:8080/api/orders';
    
    if (activeTab !== 'all') {
      url = `http://localhost:8080/api/orders/status/${activeTab}`;
    }
    
    if (searchEmail) {
      url = `http://localhost:8080/api/orders/customer?email=${searchEmail}`;
    }
    
    if (dateRange.startDate && dateRange.endDate) {
      const startISO = new Date(dateRange.startDate).toISOString();
      const endISO = new Date(dateRange.endDate).toISOString();
      url = `http://localhost:8080/api/orders/date-range?startDate=${startISO}&endDate=${endISO}`;
    }
    
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('Orders data:', data);
        if (!Array.isArray(data)) {
          throw new Error('Expected array of orders but got:', data);
        }
        setOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setLoading(false);
        setOrders([]);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveTab('all');
    fetchOrders();
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    setActiveTab('all');
    fetchOrders();
  };

  const handleClearFilters = () => {
    setSearchEmail('');
    setDateRange({ startDate: '', endDate: '' });
    setActiveTab('all');
    fetchOrders();
  };

  const viewOrderDetail = (order) => {
    setOrderDetail(order);
  };

  const closeOrderDetail = () => {
    setOrderDetail(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'PROCESSING': return 'bg-blue-500';
      case 'SHIPPED': return 'bg-indigo-600';
      case 'DELIVERED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : 
        date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(() => {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        if (orderDetail && orderDetail.id === orderId) {
          setOrderDetail({ ...orderDetail, status: newStatus });
        }
      })
      .catch(error => console.error('Error updating order status:', error));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          setOrders(orders.filter(order => order.id !== orderId));
          if (orderDetail && orderDetail.id === orderId) {
            setOrderDetail(null);
          }
        })
        .catch(error => console.error('Error deleting order:', error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow p-6">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="orders">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Your Orders
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Track and manage all your orders in one place
          </p>
        </div>

        <div className="bg-gray-800 shadow-md rounded-lg mb-10 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search by Email</label>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="email"
                  id="search"
                  placeholder="Customer email..."
                  className="flex-grow px-4 py-2 border border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                >
                  Search
                </button>
              </form>
            </div>
            
            <div className="md:w-1/2">
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
              <form onSubmit={handleDateFilter} className="flex gap-2">
                <input
                  type="date"
                  className="w-1/2 px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                />
                <input
                  type="date"
                  className="w-1/2 px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 rounded-md ${
                  activeTab === status
                    ? status === 'all' ? 'bg-indigo-600' : getStatusColor(status)
                    : 'bg-gray-700'
                } text-white`}
              >
                {status === 'all' ? 'All Orders' : status}
              </button>
            ))}
            <button
              onClick={handleClearFilters}
              className="ml-auto bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p>There are currently no orders matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                    <p className="text-gray-400 text-sm">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className={`${getStatusColor(order.status)} text-white text-sm px-3 py-1 rounded-full mr-4`}>
                      {order.status}
                    </span>
                    <span className="text-indigo-500 font-bold">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between text-gray-300 mb-4">
                  <div>
                    <p className="text-sm"><span className="text-gray-500">Customer:</span> {order.customerName}</p>
                    <p className="text-sm"><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm"><span className="text-gray-500">Items:</span> {order.items?.length || 0}</p>
                    <p className="text-sm"><span className="text-gray-500">Last Updated:</span> {formatDate(order.updatedAt)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => viewOrderDetail(order)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md mr-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Detail Modal */}
      {orderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white">Order Details #{orderDetail.id}</h3>
              <button onClick={closeOrderDetail} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Customer Information</h4>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-300"><span className="text-gray-400">Name:</span> {orderDetail.customerName}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Email:</span> {orderDetail.customerEmail}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Phone:</span> {orderDetail.phoneNumber || 'N/A'}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Address:</span> {orderDetail.shippingAddress || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Order Information</h4>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 inline-block ${getStatusColor(orderDetail.status)} text-white text-xs px-2 py-1 rounded-full`}>
                        {orderDetail.status}
                      </span>
                    </p>
                    <p className="text-gray-300"><span className="text-gray-400">Total Amount:</span> ${orderDetail.totalAmount?.toFixed(2) || '0.00'}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Order Date:</span> {formatDate(orderDetail.createdAt)}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Last Updated:</span> {formatDate(orderDetail.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-lg font-medium text-white mb-3">Order Items</h4>
              <div className="bg-gray-700 rounded-lg overflow-hidden mb-6">
                {orderDetail.items && orderDetail.items.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {orderDetail.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.productName || `Product ${item.productId}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${item.priceAtPurchase?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            ${((item.priceAtPurchase || 0) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No items found for this order
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => updateOrderStatus(orderDetail.id, status)}
                      className={`${getStatusColor(status)} hover:opacity-90 text-white px-3 py-1 rounded-md text-sm`}
                      disabled={
                        (orderDetail.status === 'DELIVERED' || orderDetail.status === 'CANCELLED') ||
                        (status === 'PROCESSING' && orderDetail.status !== 'PENDING') ||
                        (status === 'SHIPPED' && orderDetail.status !== 'PROCESSING') ||
                        (status === 'DELIVERED' && orderDetail.status !== 'SHIPPED')
                      }
                    >
                      {status === 'CANCELLED' ? 'Cancel' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
                
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Order Total</p>
                  <p className="text-xl font-bold text-indigo-500">${orderDetail.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderComponent;