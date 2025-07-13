
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Index from './pages/Index';

// Auth Components
import BuyerLogin from './auth/BuyerLogin';
import SellerLogin from './auth/SellerLogin';
import AdminLogin from './auth/AdminLogin';
import BuyerRegister from './auth/BuyerRegister';
import SellerRegister from './auth/SellerRegister';

// Buyer Components
import BuyerDashboard from './components/buyer/BuyerDashboard';
import Products from './components/buyer/Products';
import Cart from './components/buyer/Cart';
import MyOrders from './components/buyer/MyOrders';

// Seller Components
import SellerDashboard from './components/seller/SellerDashboard';
import Orders from './components/seller/Orders';
import QuotationManagement from './components/seller/QuotationManagement';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ProductManagement from './components/admin/ProductManagement';
import AdminUserManagement from './components/admin/AdminUserManagement';

// Common Components
import Profile from './components/common/Profile';
import Chat from './components/common/Chat';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const tokenMap = {
    buyer: 'buyer_token',
    seller: 'seller_token',
    admin: 'admin_token'
  };
  
  const token = localStorage.getItem(tokenMap[role]);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout Components
const BuyerLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-600">E-Commerce</h1>
            <div className="hidden md:flex space-x-4">
              <a href="/buyer/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
              <a href="/buyer/products" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Products</a>
              <a href="/buyer/cart" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Cart</a>
              <a href="/buyer/orders" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">My Orders</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a href="/buyer/profile" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Profile</a>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    {children}
  </div>
);

const SellerLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-600">E-Commerce Seller</h1>
            <div className="hidden md:flex space-x-4">
              <a href="/seller/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
              <a href="/seller/orders" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Orders</a>
              <a href="/seller/quotations" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Quotations</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a href="/seller/profile" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Profile</a>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    {children}
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">E-Commerce Admin</h1>
            <div className="hidden md:flex space-x-4">
              <a href="/admin/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
              <a href="/admin/users" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Users</a>
              <a href="/admin/products" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Products</a>
              <a href="/admin/admins" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Admins</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a href="/admin/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Profile</a>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/buyer/register" element={<BuyerRegister />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          
          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute role="buyer">
              <BuyerLayout>
                <BuyerDashboard />
              </BuyerLayout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/products" element={
            <ProtectedRoute role="buyer">
              <BuyerLayout>
                <Products />
              </BuyerLayout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/cart" element={
            <ProtectedRoute role="buyer">
              <BuyerLayout>
                <Cart />
              </BuyerLayout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/orders" element={
            <ProtectedRoute role="buyer">
              <BuyerLayout>
                <MyOrders />
              </BuyerLayout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/profile" element={
            <ProtectedRoute role="buyer">
              <BuyerLayout>
                <Profile role="buyer" />
              </BuyerLayout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/chat/:orderId" element={
            <ProtectedRoute role="buyer">
              <BuyerLayout>
                <Chat role="buyer" />
              </BuyerLayout>
            </ProtectedRoute>
          } />
          
          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={
            <ProtectedRoute role="seller">
              <SellerLayout>
                <SellerDashboard />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/orders" element={
            <ProtectedRoute role="seller">
              <SellerLayout>
                <Orders />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/quotations" element={
            <ProtectedRoute role="seller">
              <SellerLayout>
                <QuotationManagement />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/profile" element={
            <ProtectedRoute role="seller">
              <SellerLayout>
                <Profile role="seller" />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/chat/:orderId" element={
            <ProtectedRoute role="seller">
              <SellerLayout>
                <Chat role="seller" />
              </SellerLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <ProductManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/admins" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AdminUserManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Profile role="admin" />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
