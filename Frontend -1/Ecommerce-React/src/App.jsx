import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Categories from './Componets/categories';
import Products from './Componets/Product';
import OrderComponent from './Componets/OrderComponent';
import CategoryProducts from './Componets/CategoryProducts';

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
                  KRM mart
                </NavLink>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
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
            <Route path="/category-products/:categoryId" element={<CategoryProducts />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 mt-10">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} KRM Enterprises. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
};

// 🎯 Human-First, Vision-Led, Premium Home
const Home = () => (
  <div className="text-center mt-10">
    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
      Welcome to <span className="text-indigo-500">KrmHouse Admin</span>
    </h1>

    <p className="text-lg md:text-xl text-indigo-400 font-medium max-w-2xl mx-auto mb-4">
      A flagship product of <strong>KRM Enterprises</strong> — built for those who lead with purpose.
    </p>

    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4 italic">
      “True legacy is crafted in quiet decisions — and honored in every detail.”
    </p>

    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
      This is more than a dashboard. It’s a command center for visionaries — a space where decisions ripple beyond screens and into people’s lives.
    </p>

    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
      Every product, every category, every action you take here carries the DNA of trust, detail, and durability.
    </p>

    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
      This isn’t just software. It’s your brand’s silent partner — upholding your values, protecting your promise.
    </p>

    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-2">
      Leadership lives here. And so does loyalty.
    </p>

    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-6">
      KrmHouse isn’t just part of the future — it’s building it. And you're leading it.
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
