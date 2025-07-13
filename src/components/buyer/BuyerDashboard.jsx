
import React, { useState, useEffect } from 'react';
import { buyerAPI, formatCurrency, formatDate, getUserData } from '../../utils/api';
import { ShoppingCart, Package, MapPin, Bell, TrendingUp, Clock, Star, ArrowRight, Plus } from 'lucide-react';

const BuyerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: { orders: 0, totalSpent: 0, addresses: 0, cartItems: 0 },
    recentOrders: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const userData = getUserData('buyer');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load multiple data sources
      const [orders, cart] = await Promise.all([
        buyerAPI.getOrders({ limit: 5 }),
        buyerAPI.getCart()
      ]);

      // Calculate stats
      const stats = {
        orders: orders.pagination?.totalItems || 0,
        totalSpent: orders.orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
        addresses: 2, // From addresses API when available
        cartItems: cart.items?.length || 0
      };

      setDashboardData({
        stats,
        recentOrders: orders.orders || [],
        notifications: [
          { id: 1, type: 'order', message: 'Your order #1234 has been accepted!', time: '2 hours ago' },
          { id: 2, type: 'quotation', message: 'New quotation received for Order #1235', time: '4 hours ago' },
          { id: 3, type: 'system', message: 'Welcome to our platform!', time: '1 day ago' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, trend }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${gradient}`}>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white bg-opacity-10 -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white bg-opacity-5 -ml-8 -mb-8"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8 text-white/90" />
          {trend && (
            <div className="flex items-center text-sm bg-white/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-white/80 text-sm">{title}</div>
        {subtitle && <div className="text-white/60 text-xs mt-1">{subtitle}</div>}
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = "bg-gradient-to-br from-green-400 to-green-600" }) => (
    <div 
      onClick={onClick}
      className={`${color} rounded-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-lg group`}
    >
      <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
      <ArrowRight className="w-5 h-5 mt-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-green-600">{userData?.name || 'Buyer'}!</span>
          </h1>
          <p className="text-gray-600">Here's what's happening with your orders today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Total Orders"
            value={dashboardData.stats.orders}
            subtitle="All time orders"
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            trend="+12%"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Spent"
            value={formatCurrency(dashboardData.stats.totalSpent)}
            subtitle="Lifetime spending"
            gradient="bg-gradient-to-br from-green-500 to-green-700"
            trend="+8%"
          />
          <StatCard
            icon={MapPin}
            title="Saved Addresses"
            value={dashboardData.stats.addresses}
            subtitle="Delivery locations"
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <StatCard
            icon={ShoppingCart}
            title="Cart Items"
            value={dashboardData.stats.cartItems}
            subtitle="Ready to order"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order, index) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-green-50 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{order.order_name || `Order #${order.id}`}</h3>
                        <p className="text-gray-500 text-sm">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{formatCurrency(order.total_amount || 0)}</div>
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No orders yet. Start shopping!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionCard
                  icon={ShoppingCart}
                  title="Shop Now"
                  description="Browse products"
                  onClick={() => window.location.href = '/buyer/products'}
                />
                <QuickActionCard
                  icon={Package}
                  title="My Orders"
                  description="Track orders"
                  onClick={() => window.location.href = '/buyer/orders'}
                  color="bg-gradient-to-br from-blue-400 to-blue-600"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="space-y-3">
                {dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
