
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const OrderStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/orders/admin/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        toast.error('Failed to fetch order statistics');
      }
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      toast.error('Error fetching order statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading statistics...</div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      color: 'bg-blue-500',
      icon: '📦'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      color: 'bg-yellow-500',
      icon: '⏳'
    },
    {
      title: 'Processing Orders',
      value: stats.processingOrders,
      color: 'bg-blue-600',
      icon: '⚙️'
    },
    {
      title: 'Shipped Orders',
      value: stats.shippedOrders,
      color: 'bg-purple-500',
      icon: '🚚'
    },
    {
      title: 'Delivered Orders',
      value: stats.deliveredOrders,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      title: 'Cancelled Orders',
      value: stats.cancelledOrders,
      color: 'bg-red-500',
      icon: '❌'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      color: 'bg-emerald-500',
      icon: '💰'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toFixed(2)}`,
      color: 'bg-teal-500',
      icon: '📈'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Statistics</h2>
        <p className="text-gray-600">Overview of all order activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-3 rounded-full text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Distribution */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pending</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="text-gray-700 w-10 text-right">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Processing</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(stats.processingOrders / stats.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="text-gray-700 w-10 text-right">{stats.processingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Shipped</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.shippedOrders / stats.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="text-gray-700 w-10 text-right">{stats.shippedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Delivered</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.deliveredOrders / stats.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="text-gray-700 w-10 text-right">{stats.deliveredOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Cancelled</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${(stats.cancelledOrders / stats.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="text-gray-700 w-10 text-right">{stats.cancelledOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
