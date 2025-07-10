import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const fetchCategories = () => {
    const endpoint =
      activeTab === 'active'
        ? 'http://localhost:8080/api/categories/active'
        : 'http://localhost:8080/api/categories';

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  };

  const handleViewProducts = (categoryId) => {
    navigate(`/category-products/${categoryId}`);
  };

  // More precise category image mapping
  const getCategoryImage = (category) => {
    // First try to use the category's own image if available
    if (category.imageUrl) {
      return category.imageUrl;
    }

    // Create a standardized name for matching (lowercase, no spaces)
    const standardizedName = category.name.toLowerCase().replace(/\s+/g, '');

    // Precise image mapping based on standardized names
    const imageMap = {
      electronics: 'https://img.freepik.com/free-vector/electronic-devices-realistic-composition_98292-1237.jpg',
      fashion: 'https://img.freepik.com/free-photo/high-angle-clothes-arrangement_23-2148858036.jpg',
      clothing: 'https://img.freepik.com/free-photo/high-angle-clothes-arrangement_23-2148858036.jpg',
      books: 'https://img.freepik.com/free-photo/stack-books-black-table_1150-17564.jpg',
      furniture: 'https://img.freepik.com/free-photo/living-room-interior_1262-1184.jpg',
      home: 'https://img.freepik.com/free-photo/living-room-interior_1262-1184.jpg',
      groceries: 'https://img.freepik.com/free-photo/groceries_1194-6305.jpg',
      food: 'https://img.freepik.com/free-photo/groceries_1194-6305.jpg',
      sports: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg',
      toys: 'https://img.freepik.com/free-photo/colorful-plastic-toys-frame_53876-96880.jpg',
      beauty: 'https://img.freepik.com/free-photo/beauty-products_23-2147818275.jpg',
      health: 'https://img.freepik.com/free-photo/medicine-capsules-global-health-with-geometric-pattern-digital-remix_53876-104047.jpg',
      automotive: 'https://img.freepik.com/free-photo/car-parts-accessories_23-2147833213.jpg',
      jewelry: 'https://img.freepik.com/free-photo/jewelry-display-luxury-store_23-2149192227.jpg',
      default: 'https://img.freepik.com/free-vector/realistic-supermarket-shelves_1284-28047.jpg'
    };

    // Find the best matching image
    for (const [key, value] of Object.entries(imageMap)) {
      if (standardizedName.includes(key)) {
        return value;
      }
    }

    return imageMap.default;
  };

  if (loading) {
    return (
      <div className="text-white text-center p-10">Loading categories...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white">Shop by Category</h2>
          <p className="text-gray-400">Choose from our top categories</p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-l ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-r ${
              activeTab === 'active'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="h-48 bg-gray-700 overflow-hidden">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://img.freepik.com/free-vector/realistic-supermarket-shelves_1284-28047.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl text-white font-semibold">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {category.description || 'No description'}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Status: {category.active ? 'Active' : 'Inactive'} | Created: {new Date(category.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleViewProducts(category.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full"
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;