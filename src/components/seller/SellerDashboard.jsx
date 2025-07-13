
import React, { useState, useEffect } from 'react';
import { sellerAPI, formatCurrency, formatDate, getUserData } from '../../utils/api';
import { DollarSign, Package, MessageSquare, TrendingUp, Clock, Star, Users, Award, BarChart3, ArrowRight } from 'lucide-react';

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    analytics: null,
    recentActivities: [],
    performanceMetrics: {}
  });
  const [loading, setLoading] = useState(true);
  const userData = getUserData('seller');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const analytics = await sellerAPI.getAnalytics(30);
      
      // Mock recent activities (replace with actual API when available)
      const recentActivities = [
        { id: 1, type: 'order', title: 'New order received', subtitle: 'Order #1234 - $45.99', time: '2 hours ago', icon: Package },
        { id: 2, type: 'quotation', title: 'Quotation accepted', subtitle: 'Order #1233 - $67.50', time: '4 hours ago', icon: Star },
        { id: 3, type: 'message', title: 'New message', subtitle: 'From John Doe about Order #1232', time: '6 hours ago', icon: MessageSquare },
        { id: 4, type: 'completion', title: 'Order completed', subtitle: 'Order #1231 - $89.99', time: '1 day ago', icon: Award }
      ];

      setDashboardData({
        analytics,
        recentActivities,
        performanceMetrics: {
          avgResponseTime: '12 mins',
          customerRating: 4.8,
          completionRate: 95,
          totalEarnings: analytics?.stats?.total_revenue || 0
        }
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, gradient, change, isPositive = true }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${gradient}`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white bg-opacity-10 -mr-12 -mt-12"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white bg-opacity-5 -ml-10 -mb-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8 text-white/90" />
          {change && (
            <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
            }`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
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
    return (
      <div className="flex items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 group">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">{activity.title}</h3>
          <p className="text-gray-600 text-sm">{activity.subtitle}</p>
          <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    );
  };

  const QuickActionButton = ({ icon: Icon, title, onClick, color = "from-green-500 to-green-700" }) => (
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

  const stats = dashboardData.analytics?.stats || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-green-600">{userData?.name || 'Seller'}!</span>
          </h1>
          <p className="text-gray-600">Track your business performance and manage orders</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(stats.total_revenue || 0)}
            subtitle="Last 30 days"
            gradient="bg-gradient-to-br from-green-500 to-green-700"
            change="+15.2%"
          />
          <MetricCard
            icon={Package}
            title="Total Orders"
            value={stats.total_orders || 0}
            subtitle="Completed orders"
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            change="+8.1%"
          />
          <MetricCard
            icon={TrendingUp}
            title="Acceptance Rate"
            value={`${dashboardData.analytics?.quotationStats?.acceptance_rate || 0}%`}
            subtitle="Quotation success"
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            change="+3.2%"
          />
          <MetricCard
            icon={Star}
            title="Avg Rating"
            value={dashboardData.performanceMetrics.customerRating}
            subtitle="Customer feedback"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            change="+0.2"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Activities</h2>
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center">
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
                  icon={Package}
                  title="View Orders"
                  onClick={() => window.location.href = '/seller/orders'}
                />
                <QuickActionButton
                  icon={MessageSquare}
                  title="Quotations"
                  onClick={() => window.location.href = '/seller/quotations'}
                  color="from-blue-500 to-blue-700"
                />
                <QuickActionButton
                  icon={BarChart3}
                  title="Analytics"
                  onClick={() => console.log('Navigate to analytics')}
                  color="from-purple-500 to-purple-700"
                />
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-green-600">{dashboardData.performanceMetrics.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-blue-600">{dashboardData.performanceMetrics.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(dashboardData.performanceMetrics.totalEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
              <div className="space-y-3">
                {(dashboardData.analytics?.topProducts || []).slice(0, 3).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{product.name}</div>
                        <div className="text-gray-500 text-xs">{product.order_count} orders</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-sm">{formatCurrency(product.product_revenue || 0)}</div>
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

export default SellerDashboard;
