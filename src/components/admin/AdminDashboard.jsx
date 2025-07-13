
import React, { useState, useEffect } from 'react';
import { adminAPI, formatCurrency, formatDate, getUserData } from '../../utils/api';
import { Users, ShoppingBag, DollarSign, TrendingUp, UserPlus, Package, AlertTriangle, Settings, BarChart3, ArrowRight, Activity, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    systemStats: {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0
    },
    userBreakdown: {
      buyers: 0,
      sellers: 0,
      admins: 0
    },
    recentActivities: [],
    systemHealth: {
      status: 'healthy',
      uptime: '99.9%',
      lastBackup: new Date().toISOString()
    }
  });
  const [loading, setLoading] = useState(true);
  const userData = getUserData('admin');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const [buyers, sellers, admins] = await Promise.all([
        adminAPI.getBuyers({ limit: 1 }), // Just to get count
        adminAPI.getSellers({ limit: 1 }),
        adminAPI.getAdmins()
      ]);

      const userBreakdown = {
        buyers: buyers.pagination?.totalItems || 0,
        sellers: sellers.pagination?.totalItems || 0,
        admins: admins.length || 0
      };

      // Mock system stats (replace with actual analytics API)
      const systemStats = {
        totalUsers: userBreakdown.buyers + userBreakdown.sellers + userBreakdown.admins,
        totalOrders: 1247, // From analytics API when available
        totalRevenue: 45670.89, // From analytics API when available
        activeUsers: Math.floor((userBreakdown.buyers + userBreakdown.sellers) * 0.65)
      };

      // Mock recent activities
      const recentActivities = [
        { id: 1, type: 'user', title: 'New user registered', subtitle: 'John Doe (Buyer)', time: '2 hours ago', icon: UserPlus },
        { id: 2, type: 'order', title: 'Large order completed', subtitle: 'Order #1234 - $567.89', time: '4 hours ago', icon: ShoppingBag },
        { id: 3, type: 'system', title: 'System backup completed', subtitle: 'Database backup successful', time: '6 hours ago', icon: Database },
        { id: 4, type: 'alert', title: 'High traffic alert', subtitle: 'Traffic spike detected', time: '8 hours ago', icon: AlertTriangle }
      ];

      setDashboardData({
        systemStats,
        userBreakdown,
        recentActivities,
        systemHealth: {
          status: 'healthy',
          uptime: '99.9%',
          lastBackup: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, change, trend = "up" }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${gradient}`}>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white bg-opacity-10 -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white bg-opacity-5 -ml-8 -mb-8"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8 text-white/90" />
          {change && (
            <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
              trend === "up" ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
            }`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${trend === "down" ? 'rotate-180' : ''}`} />
              {change}
            </div>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-white/80 text-sm">{title}</div>
        {subtitle && <div className="text-white/60 text-xs mt-1">{subtitle}</div>}
      </div>
    </div>
  );

  const ActivityCard = ({ activity }) => {
    const Icon = activity.icon;
    const getTypeColor = (type) => {
      const colors = {
        user: 'from-blue-400 to-blue-600',
        order: 'from-green-400 to-green-600',
        system: 'from-purple-400 to-purple-600',
        alert: 'from-red-400 to-red-600'
      };
      return colors[type] || 'from-gray-400 to-gray-600';
    };

    return (
      <div className="flex items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group">
        <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(activity.type)} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{activity.title}</h3>
          <p className="text-gray-600 text-sm">{activity.subtitle}</p>
          <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    );
  };

  const QuickActionButton = ({ icon: Icon, title, onClick, color = "from-blue-500 to-blue-700" }) => (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r ${color} text-white rounded-xl p-4 flex items-center justify-center space-x-3 hover:shadow-lg transform hover:scale-105 transition-all duration-300 group`}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      <span className="font-semibold">{title}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard - <span className="text-blue-600">System Overview</span>
          </h1>
          <p className="text-gray-600">Monitor platform performance and manage system resources</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={dashboardData.systemStats.totalUsers}
            subtitle="All registered users"
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            change="+12.5%"
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={dashboardData.systemStats.totalOrders}
            subtitle="Platform-wide orders"
            gradient="bg-gradient-to-br from-green-500 to-green-700"
            change="+8.3%"
          />
          <StatCard
            icon={DollarSign}
            title="Platform Revenue"
            value={formatCurrency(dashboardData.systemStats.totalRevenue)}
            subtitle="Total transactions"
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            change="+15.7%"
          />
          <StatCard
            icon={Activity}
            title="Active Users"
            value={dashboardData.systemStats.activeUsers}
            subtitle="Last 30 days"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            change="+5.2%"
          />
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{dashboardData.userBreakdown.buyers}</div>
            </div>
            <h3 className="font-semibold text-gray-800">Buyers</h3>
            <p className="text-gray-600 text-sm">Registered customers</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600">{dashboardData.userBreakdown.sellers}</div>
            </div>
            <h3 className="font-semibold text-gray-800">Sellers</h3>
            <p className="text-gray-600 text-sm">Active vendors</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{dashboardData.userBreakdown.admins}</div>
            </div>
            <h3 className="font-semibold text-gray-800">Admins</h3>
            <p className="text-gray-600 text-sm">System administrators</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">System Activities</h2>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-2">
              {dashboardData.recentActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <QuickActionButton
                  icon={Users}
                  title="Manage Users"
                  onClick={() => window.location.href = '/admin/users'}
                />
                <QuickActionButton
                  icon={Package}
                  title="Manage Products"
                  onClick={() => window.location.href = '/admin/products'}
                  color="from-green-500 to-green-700"
                />
                <QuickActionButton
                  icon={Settings}
                  title="System Settings"
                  onClick={() => console.log('Navigate to settings')}
                  color="from-purple-500 to-purple-700"
                />
                <QuickActionButton
                  icon={BarChart3}
                  title="Analytics"
                  onClick={() => console.log('Navigate to analytics')}
                  color="from-orange-500 to-red-500"
                />
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-green-600 capitalize">{dashboardData.systemHealth.status}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-semibold text-blue-600">{dashboardData.systemHealth.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="font-semibold text-purple-600">{formatDate(dashboardData.systemHealth.lastBackup)}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg p-3 font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Run System Cleanup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
