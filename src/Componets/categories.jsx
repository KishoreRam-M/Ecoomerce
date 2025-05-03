import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all categories by default
    fetchCategories();
  }, [activeTab]);

  const fetchCategories = () => {
    const endpoint = activeTab === 'active' 
      ? 'http://localhost:8080/api/categories/active'
      : 'http://localhost:8080/api/categories';
    
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  };

  const handleViewProducts = (categoryId) => {
    // Navigate to the category products page
    navigate(`/category-products/${categoryId}`);
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
                  <div className="h-40 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
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
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" id="categories">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Browse our collection by category to find exactly what you're looking for
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Categories
            </button>
            <button
              type="button"
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Categories
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p>There are currently no categories available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {!category.active && (
                    <div className="absolute top-2 right-2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded">
                      Inactive
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    {category.name}
                    {category.active && (
                      <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {category.description || 'No description available'}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleViewProducts(category.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-300"
                    >
                      View Products
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;