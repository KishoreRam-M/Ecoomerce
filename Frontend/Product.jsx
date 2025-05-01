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
    
    // Reset URL to default and fetch products
    fetch('http://localhost:8080/api/products?page=0&size=9')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  // Loading skeleton UI
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
        
        {/* Filters and Search */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <img src={product.imageUrl} alt={product.name} className="h-64 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <p className="text-xl font-bold text-indigo-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
    </div>
  );
};

export default Products;
  
