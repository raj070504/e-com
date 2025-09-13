import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/dashboard/summary');
        if (res.data && typeof res.data.data === 'object') {
          console.log(res.data.data)
          setSummary(res.data.data);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{summary.users}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl">{summary.orders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Books</h2>
          <p className="text-2xl">{summary.books}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recentOrders?.length > 0 ? (
                summary.recentOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-4 py-2">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx}>
                          • {item.quantity} x Book ID: {item.book}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2">₹{order.totalPrice?.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">{order.paymentMethod}</td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2" colSpan="6">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;