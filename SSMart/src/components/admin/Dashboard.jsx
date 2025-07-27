import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Plus,
  TrendingUp,
  Settings,
  BarChart3,
  Loader2,
  Database
} from 'lucide-react';
import { analyticsService, initializeSampleData } from '../../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, activity] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getRecentActivity()
      ]);
      setStats(dashboardStats);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeData = async () => {
    try {
      setInitializing(true);
      await initializeSampleData();
      await fetchDashboardData(); // Refresh data
      alert('Sample data initialized successfully!');
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Error initializing data. Please try again.');
    } finally {
      setInitializing(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change = '+12%' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{change}</span>
          </div>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, href, colorScheme = 'blue' }) => {
    const colorClasses = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-100',
        text: 'text-blue-600'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-100',
        text: 'text-green-600'
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-100',
        text: 'text-purple-600'
      },
      orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-100',
        text: 'text-orange-600'
      },
      indigo: {
        border: 'border-indigo-500',
        bg: 'bg-indigo-100',
        text: 'text-indigo-600'
      },
      gray: {
        border: 'border-gray-500',
        bg: 'bg-gray-100',
        text: 'text-gray-600'
      }
    };

    const colors = colorClasses[colorScheme] || colorClasses.blue;

    return (
      <Link
        to={href}
        className={`block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 ${colors.border}`}
      >
        <div className="flex items-center">
          <div className={`p-3 ${colors.bg} rounded-lg`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex space-x-3">
          {stats.totalProducts === 0 && (
            <button
              onClick={handleInitializeData}
              disabled={initializing}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {initializing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              {initializing ? 'Initializing...' : 'Initialize Sample Data'}
            </button>
          )}
          <Link
            to="/admin/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Add New Product"
            description="Create a new product listing"
            icon={Plus}
            href="/admin/products"
            colorScheme="blue"
          />
          <QuickAction
            title="View All Products"
            description="Manage your product catalog"
            icon={Package}
            href="/admin/products"
            colorScheme="green"
          />
          <QuickAction
            title="View Orders"
            description="Check recent orders and status"
            icon={ShoppingCart}
            href="/admin/orders"
            colorScheme="purple"
          />
          <QuickAction
            title="Customer Management"
            description="View and manage customers"
            icon={Users}
            href="/admin/customers"
            colorScheme="orange"
          />
          <QuickAction
            title="Analytics"
            description="View sales and performance data"
            icon={BarChart3}
            href="/admin/analytics"
            colorScheme="indigo"
          />
          <QuickAction
            title="Settings"
            description="Configure your store settings"
            icon={Settings}
            href="/admin/settings"
            colorScheme="gray"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.status === 'completed' ? 'bg-green-400' :
                    activity.status === 'shipped' ? 'bg-blue-400' :
                    activity.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">{activity.message}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {activity.timestamp ? new Date(activity.timestamp.toDate()).toLocaleString() : 'Recently'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 