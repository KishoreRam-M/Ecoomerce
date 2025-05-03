import React, { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Cart functionality
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    phoneNumber: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // Fetch categories for filter
    fetch('http://localhost:8080/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));

    // Initial products load
    fetchProducts();
  }, [currentPage, sortBy, selectedCategory]);

  const fetchProducts = () => {
    let url = `http://localhost:8080/api/products?page=${currentPage}&size=9`;
    
    // Add sorting parameters
    if (sortBy === 'price-asc') {
      url += '&sortBy=price&direction=asc';
    } else if (sortBy === 'price-desc') {
      url += '&sortBy=price&direction=desc';
    } else if (sortBy === 'newest') {
      url += '&sortBy=createdAt&direction=desc';
    }
    
    // Add category filter if selected
    if (selectedCategory) {
      url = `http://localhost:8080/api/products/category/${selectedCategory}?page=${currentPage}&size=9`;
    }
    
    // Add search term if present
    if (searchTerm) {
      url = `http://localhost:8080/api/products/search?keyword=${searchTerm}&page=${currentPage}&size=9`;
    }
    
    // Add price range if both min and max are provided
    if (priceRange.min !== '' && priceRange.max !== '') {
      url = `http://localhost:8080/api/products/price-range?min=${priceRange.min}&max=${priceRange.max}&page=${currentPage}&size=9`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchProducts();
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchProducts();
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategory(null);
    setSortBy('default');
    setCurrentPage(0);
    
    fetch('http://localhost:8080/api/products?page=0&size=9')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

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

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  const placeOrder = () => {
    // Validate customer info
    if (!customerInfo.customerName || !customerInfo.customerEmail || 
        !customerInfo.shippingAddress || !customerInfo.phoneNumber) {
      alert('Please fill in all customer information fields');
      return;
    }

    // Create order object
    const orderData = {
      ...customerInfo,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    // Send order to API
    fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      return response.json();
    })
    .then(data => {
      // Reset cart and show success message
      setCart([]);
      setOrderSuccess(true);
      
      // Reset form
      setCustomerInfo({
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        phoneNumber: ''
      });
      
      // Close cart modal after delay
      setTimeout(() => {
        setOrderSuccess(false);
        setShowCart(false);
      }, 3000);
    })
    .catch(error => {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow">
                  <div className="h-64 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-600 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="product">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Our Products
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Discover our premium collection of thoughtfully curated items
          </p>
        </div>
        
        {/* Cart summary button */}
        <div className="fixed top-4 right-4 z-10">
          <button 
            onClick={() => setShowCart(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>
        
        <div className="bg-gray-800 shadow-md rounded-lg mb-10 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  id="search"
                  placeholder="Search products..."
                  className="flex-grow px-4 py-2 border border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>
            
            <div className="md:w-1/3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryChange(e.target.value === '' ? null : e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="md:w-1/3">
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                id="sortBy"
                className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="md:w-1/3">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-300 mb-1">Price Range</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
                <button
                  onClick={handlePriceFilter}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  Filter
                </button>
              </div>
            </div>
            
            <button
              onClick={handleClearFilters}
              className="mt-4 md:mt-0 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <img src={product.imageUrl} alt={product.name} className="h-64 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-indigo-600">${product.price}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Previous
          </button>
          <span className="text-white mx-4">{currentPage + 1} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white">Your Shopping Cart</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
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
                  {orderSuccess ? (
                    <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white mb-2">Order Placed Successfully!</h3>
                      <p className="text-gray-300">Thank you for your order. You'll receive a confirmation email shortly.</p>
                    </div>
                  ) : (
                    <>
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
                                    <img src={item.product.imageUrl} alt={item.product.name} className="h-10 w-10 object-cover rounded-md mr-3" />
                                    {item.product.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${item.product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  <div className="flex items-center">
                                    <button 
                                      onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                                      className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                      </svg>
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                                      className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md"
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

                      <div className="flex justify-end mb-6">
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Cart Total</p>
                          <p className="text-xl font-bold text-indigo-500">${calculateCartTotal().toFixed(2)}</p>
                        </div>
                      </div>

                      <h4 className="text-lg font-medium text-white mb-3">Customer Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                          <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                            value={customerInfo.customerName}
                            onChange={handleCustomerInfoChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                          <input
                            type="email"
                            id="customerEmail"
                            name="customerEmail"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                            value={customerInfo.customerEmail}
                            onChange={handleCustomerInfoChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                            value={customerInfo.phoneNumber}
                            onChange={handleCustomerInfoChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-300 mb-1">Shipping Address</label>
                          <input
                            type="text"
                            id="shippingAddress"
                            name="shippingAddress"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white bg-gray-800"
                            value={customerInfo.shippingAddress}
                            onChange={handleCustomerInfoChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={placeOrder}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
                        >
                          Place Order
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;