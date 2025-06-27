import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch category and products
    fetch(`http://localhost:8080/api/categories/${categoryId}`)
      .then(response => {
        if (!response.ok) throw new Error('Category not found');
        return response.json();
      })
      .then(data => {
        setCategory(data);
        return fetch('http://localhost:8080/api/products');
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to load products');
        return response.json();
      })
      .then(data => {
        // Check if data is an array, if not, try to extract the array
        let productsArray = data;
        
        // If data is not an array but an object, check for common properties that might contain the products
        if (!Array.isArray(data)) {
          if (data.products && Array.isArray(data.products)) {
            productsArray = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            productsArray = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            productsArray = data.items;
          } else if (data.content && Array.isArray(data.content)) {
            productsArray = data.content;
          } else {
            // If we can't find an array, throw an error
            throw new Error('Unexpected API response format: products data is not an array');
          }
        }
        
        const categoryProducts = productsArray.filter(
          product => product.category && product.category.id === parseInt(categoryId)
        );
        setProducts(categoryProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4 16l4.586-4.586a2 2 0 012.828 0L16 16M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-300">{error}</p>
            <Link to="/categories" className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/categories" className="text-indigo-500 hover:text-indigo-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0L2.293 10a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Categories
          </Link>
        </div>

        {category && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{category.name}</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">{category.description || 'Browse products in this category'}</p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p>There are currently no products available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded">
                      Out of stock
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{product.description || 'No description available'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">${product.price?.toFixed(2) || '0.00'}</span>
                    <Link
                      to={`/products/${product.id}`}
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${
                        product.stock > 0
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={e => product.stock <= 0 && e.preventDefault()}
                    >
                      {product.stock > 0 ? 'View Details' : 'Out of Stock'}
                    </Link>
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

export default CategoryProducts;