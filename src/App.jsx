import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Categories from './Componets/categories';
import Products from './Componets/Product';
import OrderComponent from './Componets/OrderComponent';

const App = () => {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen">
        {/* Navbar */}
        <nav className="bg-gray-900 border-b border-gray-800 fixed w-full z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <NavLink to="/" className="flex-shrink-0 text-indigo-600 text-2xl font-bold">
                KRM's EcomHub
                </NavLink>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/" className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }>
                  Home
                </NavLink>
                <NavLink to="/categories" className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }>
                  Categories
                </NavLink>
                <NavLink to="/products" className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }>
                  Products
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }>
                  Orders
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <div className="pt-20 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<OrderComponent />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 mt-10">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} EcomHub Admin. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
};

// ✅ Simple Home Page Hero
const Home = () => (
  <div className="text-center mt-10">
    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
      Modern E-commerce <span className="text-indigo-500">Admin Dashboard</span>
    </h1>
    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
      Manage your products, categories, and orders with our powerful admin interface.
    </p>
    <div className="flex justify-center gap-4">
      <NavLink to="/categories" className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
        View Categories
      </NavLink>
      <NavLink to="/products" className="px-6 py-3 text-white bg-gray-700 hover:bg-gray-600 rounded-md">
        Browse Products
      </NavLink>
    </div>
  </div>
);

export default App;
