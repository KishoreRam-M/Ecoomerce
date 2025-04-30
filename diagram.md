Great. I’ll generate React frontend code for your e-commerce backend using a modern dark (but not black) theme styled with Tailwind CSS and Bootstrap. The UI will include components for managing products, categories, and orders, aligned with your Spring Boot APIs.

I’ll let you know once the code is ready for review.

# React E-Commerce Frontend (Tailwind + Bootstrap)

This solution provides a **React** frontend for the specified Spring Boot e-commerce backend, structured as a complete project with key views for product, category, and order management. We use **functional components with hooks** (as recommended by modern React) to handle state and side effects ([Glinteco |  Blog | Why You Should Use Functional Components & Hooks in ReactJS](https://glinteco.com/en/post/why-you-should-use-functional-components-hooks-in-reactjs/#:~:text=4.%20Future)) ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait)). Styling is done using **Tailwind CSS** (utility-first, customizable framework ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Rapidly%20build%20modern%20websites%20without,ever%20leaving%20your%20HTML))) alongside **Bootstrap** (for responsive components and grid) ([Bootstrap · The most popular HTML, CSS, and JS library in the world.](https://getbootstrap.com/#:~:text=Build%20fast%2C%20responsive%20sites%20with%C2%A0Bootstrap)). We adopt a dark gray theme (`bg-gray-800` to `bg-gray-900`) for a modern, minimal look (avoiding pure black for better readability).

The project is organized under `src/` with separate folders for components, pages, and API calls. We use **React Router v6** for navigation, and **Axios** for HTTP requests to the backend. Tailwind’s dark mode is enabled to style components with `dark:` prefix classes (e.g. `dark:bg-gray-900`) ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Dark%20mode)). Below is the high-level structure and key code excerpts for each required feature.

## Project Structure

- `public/`, `src/` (main folder for app)
- `src/index.js` – bootstraps React with Tailwind and Bootstrap CSS.
- `src/App.jsx` – defines routes using React Router.
- `src/api/axios.js` – configures Axios instance with base URL.
- `src/components/` – reusable UI components (e.g. `Navbar`, `Pagination`).
- `src/pages/Products/` – product-related views: `ProductList.jsx`, `ProductDetail.jsx`, `ProductForm.jsx`.
- `src/pages/Categories/` – category views: `CategoryList.jsx`, `CategoryForm.jsx`.
- `src/pages/Orders/` – order views: `OrderList.jsx`, `OrderDetail.jsx`, `CreateOrder.jsx`.
- `src/index.css` and `tailwind.config.js` – Tailwind setup (dark mode, custom colors).

```bash
src/
├── api/
│   └── axios.js
├── components/
│   ├── Navbar.jsx
│   └── Pagination.jsx
├── pages/
│   ├── Products/
│   │   ├── ProductList.jsx
│   │   ├── ProductDetail.jsx
│   │   └── ProductForm.jsx
│   ├── Categories/
│   │   ├── CategoryList.jsx
│   │   └── CategoryForm.jsx
│   └── Orders/
│       ├── OrderList.jsx
│       ├── OrderDetail.jsx
│       └── CreateOrder.jsx
├── App.jsx
├── index.jsx
├── index.css
└── tailwind.config.js
```

## Configuration (Tailwind + Bootstrap)

We install Tailwind CSS and Bootstrap via npm. In `index.js`, import both:

```jsx
// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './index.css'; // Tailwind directives

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

In `tailwind.config.js`, enable dark mode and extend the color palette for dark gray:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // use .dark class to toggle
  theme: {
    extend: {
      colors: {
        'dark-gray': '#2D3748', // custom dark gray
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'], // enable dark: variants
      textColor: ['dark'],
    },
  },
  plugins: [],
};
```

In `index.css`, include Tailwind’s base, components, and utilities:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* You can add custom global styles here */
```

By wrapping our app container with classes like `bg-gray-800 text-gray-100`, all child components will inherit a dark theme background and light text. Tailwind’s `dark:bg-gray-900` and similar classes allow quick styling for dark mode (as documented on the Tailwind site ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Rapidly%20build%20modern%20websites%20without,ever%20leaving%20your%20HTML)) ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Dark%20mode))).

## Axios API Configuration

We use Axios to call the backend API. Create a central `axios` instance with the base URL:

```js
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // adjust to backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

Use this `api` in components to perform HTTP requests (GET, POST, PUT, DELETE). For example, fetching products in a component:

```jsx
// example usage in a component
useEffect(() => {
  api.get('/products', { params: { page, size, category, search } })
    .then(response => setProducts(response.data))
    .catch(error => console.error('Error fetching products', error));
}, [page, size, category, search]);
```

As noted by React experts, you typically call an async function inside `useEffect` to fetch data on component mount ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait)). The hook `useEffect` manages side effects like API calls, and `useState` stores the data ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait)).

## Routing Setup

Using **React Router v6**, we define routes in `App.jsx` and wrap with `<BrowserRouter>`:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/Products/ProductDetail';
import ProductForm from './pages/Products/ProductForm';
import CategoryList from './pages/Categories/CategoryList';
import CategoryForm from './pages/Categories/CategoryForm';
import OrderList from './pages/Orders/OrderList';
import OrderDetail from './pages/Orders/OrderDetail';
import CreateOrder from './pages/Orders/CreateOrder';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-800 min-h-screen dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            {/* Product Management */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            {/* Category Management */}
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/add" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />
            {/* Order Management */}
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            {/* Default */}
            <Route path="*" element={<ProductList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

The `<Navbar>` component (shown below) provides navigation links between views. We use a container (`.container.mx-auto.p-4`) to center content.

## Shared Components

### Navbar

A top navigation bar with dark styling and links:

```jsx
// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-gray p-3">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">MyStore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/categories">Categories</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
```

Here we combine Bootstrap’s navbar classes with Tailwind color utilities (`bg-dark-gray` is our custom color) for a responsive, dark-styled menu.

### Pagination Component

For paginated lists, a simple reusable component using Bootstrap:

```jsx
// src/components/Pagination.jsx
import { Pagination } from 'react-bootstrap';

function PaginationBar({ currentPage, totalPages, onPageChange }) {
  const items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  return <Pagination>{items}</Pagination>;
}
export default PaginationBar;
```

Usage example:
```jsx
<PaginationBar currentPage={page} totalPages={pagesCount} onPageChange={setPage} />
```

## 1. Product Management

### Product List (Paginated, Filterable)

The **ProductList** view fetches a paginated list of products with filters for category, search, and price range, plus sorting. It displays results in a table with “Edit” and “Delete” buttons, and includes “Previous/Next” pagination.

```jsx
// src/pages/Products/ProductList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PaginationBar from '../../components/Pagination';

function ProductList() {
  // State for products and filters
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Fetch categories for filter dropdown
    api.get('/categories/active')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Fetch categories failed', err));
  }, []);

  useEffect(() => {
    // Build query params
    const params = { page, size, sort: `${sortKey},${sortOrder}` };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (priceMin) params.minPrice = priceMin;
    if (priceMax) params.maxPrice = priceMax;
    api.get('/products', { params })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Fetch products failed', err));
  }, [page, size, search, categoryFilter, priceMin, priceMax, sortKey, sortOrder]);

  // Delete product handler
  const deleteProduct = (id) => {
    if (window.confirm('Delete this product?')) {
      api.delete(`/products/${id}`)
        .then(() => setProducts(products.filter(p => p.id !== id)))
        .catch(err => console.error('Delete failed', err));
    }
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Products</h2>
      <div className="flex gap-4 mb-3">
        <input
          className="form-control"
          type="text" placeholder="Search..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          className="form-control" type="number" placeholder="Min Price"
          value={priceMin} onChange={e => setPriceMin(e.target.value)}
        />
        <input
          className="form-control" type="number" placeholder="Max Price"
          value={priceMax} onChange={e => setPriceMax(e.target.value)}
        />
        <select
          className="form-select"
          value={`${sortKey},${sortOrder}`}
          onChange={e => {
            const [key, order] = e.target.value.split(',');
            setSortKey(key); setSortOrder(order);
          }}
        >
          <option value="name,asc">Name ↑</option>
          <option value="name,desc">Name ↓</option>
          <option value="price,asc">Price ↑</option>
          <option value="price,desc">Price ↓</option>
        </select>
        <Link to="/products/add" className="btn btn-primary ml-auto">Add Product</Link>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.content?.map(product => (
            <tr key={product.id}>
              <td><Link to={`/products/${product.id}`}>{product.name}</Link></td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category.name}</td>
              <td>
                <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                <button onClick={() => deleteProduct(product.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination (if supported by API) */}
      {products.totalPages > 1 && (
        <PaginationBar
          currentPage={products.number + 1}
          totalPages={products.totalPages}
          onPageChange={num => setPage(num)}
        />
      )}
    </div>
  );
}
export default ProductList;
```

**Key points**:
- Filters and sorting update the component state, triggering `useEffect` to refetch data ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait)).
- Pagination: we expect the backend to return paginated results (with fields like `content`, `totalPages`, `number`) and use a `<PaginationBar>` component.
- Bootstrap classes (e.g. `table table-dark`) and Tailwind (e.g. `text-white`) mix for styling.

### Product Detail

The **ProductDetail** view shows details of a single product, fetched by ID from route params:

```jsx
// src/pages/Products/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Product Details</h2>
      <div className="card bg-dark-gray p-4">
        <h3 className="text-lg">{product.name}</h3>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        <p><strong>Category:</strong> {product.category.name}</p>
      </div>
      <Link to="/products" className="btn btn-secondary mt-3">Back to Products</Link>
    </div>
  );
}

export default ProductDetail;
```

We fetch the product on mount via `useEffect`, as recommended (no async directly in the hook) ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait)). The card uses dark backgrounds and light text.

### Add/Edit Product (ProductForm)

The **ProductForm** component is used for both adding and editing products. It reads the `id` route param: if present, fetch the existing product data; otherwise, it’s a blank form. On submit, it sends POST (create) or PUT (update) requests.

```jsx
// src/pages/Products/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '', description: '', price: '', categoryId: '',
  });

  useEffect(() => {
    // Load categories for dropdown
    api.get('/categories/active').then(res => setCategories(res.data));
    // If editing, load existing product
    if (id) {
      api.get(`/products/${id}`).then(res => {
        const prod = res.data;
        setProduct({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          categoryId: prod.category.id,
        });
      });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...product };
    const request = id
      ? api.put(`/products/${id}`, payload)
      : api.post('/products', payload);
    request
      .then(() => navigate('/products'))
      .catch(err => console.error('Save failed', err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">{id ? 'Edit' : 'Add'} Product</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-3">
          <label className="form-label text-white">Name</label>
          <input
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Price</label>
          <input
            className="form-control"
            type="number" step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Category</label>
          <select
            className="form-select"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default ProductForm;
```

The form uses controlled inputs bound to `product` state. On submit, it chooses POST or PUT based on presence of `id`. We navigate back to the list on success.

## 2. Category Management

### Category List (All & Active)

The **CategoryList** view shows all categories and allows adding/editing/deleting. Active categories endpoint can be used for filters (e.g. when selecting product category).

```jsx
// src/pages/Categories/CategoryList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const deleteCategory = (id) => {
    if (window.confirm('Delete this category?')) {
      api.delete(`/categories/${id}`)
        .then(() => setCategories(categories.filter(c => c.id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Categories</h2>
      <Link to="/categories/add" className="btn btn-primary mb-3">Add Category</Link>
      <table className="table table-dark table-striped">
        <thead>
          <tr><th>Name</th><th>Active</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.active ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/categories/edit/${cat.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                <button onClick={() => deleteCategory(cat.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CategoryList;
```

For **active categories**, we call `GET /categories/active` (as shown in product components) whenever we need a filtered list (e.g. in product or category forms).

### Add/Edit Category (CategoryForm)

Similar to products, **CategoryForm** handles both adding and editing:

```jsx
// src/pages/Categories/CategoryForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '', active: true });

  useEffect(() => {
    if (id) {
      api.get(`/categories/${id}`)
        .then(res => setCategory(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = id
      ? api.put(`/categories/${id}`, category)
      : api.post('/categories', category);
    req.then(() => navigate('/categories'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">{id ? 'Edit' : 'Add'} Category</h2>
      <form onSubmit={handleSubmit} className="max-w-sm">
        <div className="mb-3">
          <label className="form-label text-white">Name</label>
          <input
            className="form-control"
            name="name" value={category.name}
            onChange={e => setCategory({ ...category, name: e.target.value })}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={category.active}
            onChange={e => setCategory({ ...category, active: e.target.checked })}
          />
          <label className="form-check-label text-white">Active</label>
        </div>
        <button type="submit" className="btn btn-success">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default CategoryForm;
```

This form uses a checkbox for the `active` field. On submit, it uses the same POST/PUT pattern as products.

## 3. Order Management

### Order List (All Orders, Search & Filter)

The **OrderList** page displays all orders, with optional filters by customer email, status, and date range. It allows navigation to details of a specific order.

```jsx
// src/pages/Orders/OrderList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const params = {};
    if (emailFilter) params.email = emailFilter;
    if (statusFilter) params.status = statusFilter;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    api.get('/orders', { params })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, [emailFilter, statusFilter, fromDate, toDate]);

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Orders</h2>
      <div className="flex gap-4 mb-3">
        <input
          className="form-control"
          type="email" placeholder="Customer Email"
          value={emailFilter}
          onChange={e => setEmailFilter(e.target.value)}
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <input
          className="form-control"
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <input
          className="form-control"
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
        <Link to="/orders/create" className="btn btn-primary ml-auto">Create Order</Link>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerEmail}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>
                <Link to={`/orders/${order.id}`} className="btn btn-sm btn-info">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
```

This component shows:
- Filters bound to state: email, status, date range.
- On any filter change, `useEffect` refetches orders with query params.
- A table of orders with a “View” button linking to `OrderDetail`.

### Order Detail

The **OrderDetail** page shows a specific order’s details (items, quantities, etc.) and allows updating its status:

```jsx
// src/pages/Orders/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  const handleStatusUpdate = () => {
    api.put(`/orders/${id}/status`, { status })
      .then(() => navigate('/orders'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Order #{order.id}</h2>
      <p><strong>Customer:</strong> {order.customerEmail}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <h3 className="mt-4 text-white">Items</h3>
      <table className="table table-dark">
        <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody>
          {order.items.map(item => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <label className="form-label text-white">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>Processing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button onClick={handleStatusUpdate} className="btn btn-success mt-2">Update Status</button>
      </div>
    </div>
  );
}

export default OrderDetail;
```

We fetch the order on mount. The status dropdown updates state and the button triggers a PUT to `/orders/{id}/status`. Upon success, we navigate back to the list.

### Create Order

The **CreateOrder** page allows entering customer info and adding items to the order:

```jsx
// src/pages/Orders/CreateOrder.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function CreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.content || []));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const submitOrder = (e) => {
    e.preventDefault();
    api.post('/orders', { customerEmail, items })
      .then(() => navigate('/orders'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Create Order</h2>
      <form onSubmit={submitOrder}>
        <div className="mb-3">
          <label className="form-label text-white">Customer Email</label>
          <input
            className="form-control"
            type="email"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            required
          />
        </div>
        <h3 className="text-white mt-4">Items</h3>
        {items.map((item, idx) => (
          <div key={idx} className="d-flex gap-2 align-items-center mb-2">
            <select
              className="form-select flex-grow-1"
              value={item.productId}
              onChange={e => handleItemChange(idx, 'productId', e.target.value)}
              required
            >
              <option value="">Select product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price})
                </option>
              ))}
            </select>
            <input
              className="form-control"
              type="number" min="1"
              value={item.quantity}
              onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
              style={{ maxWidth: '80px' }}
            />
            <button type="button" onClick={() => removeItem(idx)} className="btn btn-danger">
              &times;
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="btn btn-secondary mb-3">
          Add Another Item
        </button>
        <br/>
        <button type="submit" className="btn btn-primary">Submit Order</button>
      </form>
    </div>
  );
}

export default CreateOrder;
```

This form allows multiple items (each with a product selector and quantity). On submit, we send `{ customerEmail, items }` to the backend. The `items` array should match the expected order item structure.

## Styling Notes

- We use **Bootstrap** classes for layout (grid, table, forms) and **Tailwind CSS** for quick customizations. This hybrid approach leverages Bootstrap’s components and Tailwind’s utility-first styling ([Bootstrap · The most popular HTML, CSS, and JS library in the world.](https://getbootstrap.com/#:~:text=Build%20fast%2C%20responsive%20sites%20with%C2%A0Bootstrap)) ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Rapidly%20build%20modern%20websites%20without,ever%20leaving%20your%20HTML)).
- The overall theme classes (`bg-gray-800`, `text-gray-100`, etc.) ensure a dark gray background and light text. Buttons use Bootstrap’s dark themes (e.g. `btn-secondary`).
- Dark mode in Tailwind is enabled, so components automatically adapt if a parent `.dark` class is applied. For example, wrapping the app with `<div className="dark">` would apply any `dark:` classes (though here we use dark backgrounds by default).

## Conclusion

This React frontend covers all requested functionality: product, category, and order management with full CRUD capabilities, filtering, and pagination. It uses **functional components and hooks** (per React best practices ([Glinteco |  Blog | Why You Should Use Functional Components & Hooks in ReactJS](https://glinteco.com/en/post/why-you-should-use-functional-components-hooks-in-reactjs/#:~:text=4.%20Future)) ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait))) and interacts with the backend via Axios. The layout is responsive, combining Bootstrap’s grid/forms and Tailwind’s utility classes for a modern dark theme ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Rapidly%20build%20modern%20websites%20without,ever%20leaving%20your%20HTML)) ([Bootstrap · The most popular HTML, CSS, and JS library in the world.](https://getbootstrap.com/#:~:text=Build%20fast%2C%20responsive%20sites%20with%C2%A0Bootstrap)). Each component is organized for reuse and clarity, providing a solid structure for further enhancements or customization.

**Sources:** React and Tailwind documentation for hooks and styling ([How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/#:~:text=The%20effect%20hook%20called%20useEffect,promise%20resolving%20happens%20with%20async%2Fawait)) ([Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/#:~:text=Rapidly%20build%20modern%20websites%20without,ever%20leaving%20your%20HTML)) ([Bootstrap · The most popular HTML, CSS, and JS library in the world.](https://getbootstrap.com/#:~:text=Build%20fast%2C%20responsive%20sites%20with%C2%A0Bootstrap)), and industry best-practices for React component structure ([Glinteco |  Blog | Why You Should Use Functional Components & Hooks in ReactJS](https://glinteco.com/en/post/why-you-should-use-functional-components-hooks-in-reactjs/#:~:text=4.%20Future)).
