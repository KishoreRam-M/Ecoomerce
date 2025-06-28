import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/categories/${categoryId}`),
          fetch('http://localhost:8080/api/products')
        ]);

        if (!categoryResponse.ok) throw new Error('Category not found');
        if (!productsResponse.ok) throw new Error('Failed to load products');

        const [categoryData, productsData] = await Promise.all([
          categoryResponse.json(),
          productsResponse.json()
        ]);

        setCategory(categoryData);

        let productsArray = Array.isArray(productsData) ? productsData : 
          productsData.products || productsData.data || 
          productsData.items || productsData.content || [];

        const categoryProducts = productsArray.filter(
          product => product.category && product.category.id === parseInt(categoryId)
        );
        setProducts(categoryProducts);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        {category && (
          <CategoryHeader category={category} />
        )}

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} getImageUrl={getImageUrl} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component Sub-parts
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-10 bg-gray-700 rounded w-1/3 mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow">
          <div className="aspect-square bg-gray-700"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="text-center">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4 16l4.586-4.586a2 2 0 012.828 0L16 16M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
      <p className="text-gray-300 mb-6">{error}</p>
      <Link to="/categories" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
        Back to Categories
      </Link>
    </div>
  </div>
);

const BackButton = () => (
  <div className="mb-8">
    <Link to="/categories" className="inline-flex items-center text-indigo-500 hover:text-indigo-400 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0L2.293 10a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      Back to Categories
    </Link>
  </div>
);

const CategoryHeader = ({ category }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{category.name}</h1>
    <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
      {category.description || 'Browse our selection of products in this category'}
    </p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
    <p className="text-gray-500">We couldn't find any products in this category.</p>
  </div>
);

const ProductCard = ({ product, getImageUrl }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
    <div className="relative aspect-square w-full overflow-hidden bg-gray-700">
      {product.imageUrl ? (
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x500?text=Product+Image';
            e.target.className = 'absolute inset-0 w-full h-full object-contain p-4 bg-gray-700';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      {product.stock <= 0 && (
        <div className="absolute top-2 right-2 bg-gray-900/90 text-gray-300 text-xs px-2 py-1 rounded-full">
          Out of stock
        </div>
      )}
    </div>
    
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 min-h-[2.5rem]">
        {product.name}
      </h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-grow">
        {product.description || 'No description available'}
      </p>
      <div className="flex justify-between items-center mt-auto pt-2">
        <span className="text-lg font-bold text-white">
          ${product.price?.toFixed(2) || '0.00'}
        </span>
        <Link
          to={`/products/${product.id}`}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            product.stock > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          onClick={e => product.stock <= 0 && e.preventDefault()}
        >
          {product.stock > 0 ? 'View' : 'Sold Out'}
        </Link>
      </div>
    </div>
  </div>
);

export default CategoryProducts;