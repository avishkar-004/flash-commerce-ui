
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as HotToaster } from 'react-hot-toast';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Components
import BuyerLogin from './auth/BuyerLogin';
import SellerLogin from './auth/SellerLogin';
import AdminLogin from './auth/AdminLogin';
import BuyerRegister from './auth/BuyerRegister';
import SellerRegister from './auth/SellerRegister';

// Buyer Components
import BuyerDashboard from './components/buyer/BuyerDashboard';

// Seller Components
import SellerDashboard from './components/seller/SellerDashboard';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const tokenMap = {
    buyer: 'buyer_token',
    seller: 'seller_token',
    admin: 'admin_token'
  };
  
  const token = localStorage.getItem(tokenMap[role as keyof typeof tokenMap]);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Layout Components
const BuyerLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-600">E-Commerce</h1>
            <div className="hidden md:flex space-x-4">
              <a href="/buyer/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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

const SellerLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">E-Commerce Seller</h1>
            <div className="hidden md:flex space-x-4">
              <a href="/seller/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-purple-600">E-Commerce Admin</h1>
            <div className="hidden md:flex space-x-4">
              <a href="/admin/dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster position="top-right" />
      <BrowserRouter>
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
          
          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={
            <ProtectedRoute role="seller">
              <SellerLayout>
                <SellerDashboard />
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
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
