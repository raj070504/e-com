import React, { useEffect, useState } from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5001/api/orders/myorders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'Out for Delivery': 'bg-orange-100 text-orange-800 border-orange-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Processing': '⚙️',
      'Shipped': '🚚',
      'Out for Delivery': '🚛',
      'Delivered': '✅',
      'Cancelled': '❌'
    };
    return icons[status] || '📦';
  };

  const getDeliveryMessage = (status, createdAt) => {
    if (status === 'Delivered') {
      return 'Package delivered successfully!';
    } else if (status === 'Out for Delivery') {
      return 'Your package is out for delivery today!';
    } else if (status === 'Shipped') {
      return 'Your package is on the way!';
    } else if (status === 'Processing') {
      return 'Your order is being prepared for shipment';
    } else if (status === 'Cancelled') {
      return 'This order has been cancelled';
    } else {
      return 'Your order is being processed';
    }
  };

  const getEstimatedDelivery = (status, createdAt) => {
    const orderDate = new Date(createdAt);
    let deliveryDate;
    
    switch (status) {
      case 'Delivered':
        return 'Delivered';
      case 'Out for Delivery':
        deliveryDate = new Date(orderDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        return `Today - ${deliveryDate.toLocaleDateString()}`;
      case 'Shipped':
        deliveryDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        return `Expected: ${deliveryDate.toLocaleDateString()}`;
      case 'Processing':
        deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        return `Expected: ${deliveryDate.toLocaleDateString()}`;
      case 'Cancelled':
        return 'Cancelled';
      default:
        deliveryDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
        return `Expected: ${deliveryDate.toLocaleDateString()}`;
    }
  };

  const renderOrderProgress = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(status);
    
    if (status === 'Cancelled') {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center text-red-600">
            <span className="text-2xl mr-2">❌</span>
            <span className="font-medium">Order Cancelled</span>
          </div>
        </div>
      );
    }

    return (
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                index <= currentStepIndex 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-400 border-gray-300'
              }`}>
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <div className={`text-xs mt-2 text-center max-w-20 ${
                index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </div>
            </div>
          ))}
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 -z-10">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600">Loading your orders...</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h2>
        <p className="text-gray-600">Track and manage your book orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 text-lg mb-6">Start exploring our amazing collection of books!</p>
          <Link 
            to="/books" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span className="mr-2">📖</span>
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                  <div className="mb-3 lg:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-start lg:items-end">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center ${getStatusColor(order.status)}`}>
                      <span className="mr-2">{getStatusIcon(order.status)}</span>
                      {order.status}
                    </span>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.isPaid 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {order.isPaid ? '💳 Paid' : '💰 Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Progress */}
              <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
                {renderOrderProgress(order.status)}
                <div className="text-center mt-4">
                  <p className="text-gray-700 font-medium">{getDeliveryMessage(order.status, order.createdAt)}</p>
                  <p className="text-sm text-blue-600 font-semibold mt-1">{getEstimatedDelivery(order.status, order.createdAt)}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-lg">📍</span>
                    <div>
                      <span className="font-medium text-gray-900">Delivery Address:</span>
                      <p className="text-gray-700">{order.shippingAddress?.address}</p>
                      <p className="text-gray-700">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipcode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-lg">📞</span>
                    <div>
                      <span className="font-medium text-gray-900">Contact:</span>
                      <p className="text-gray-700">{order.shippingAddress?.phone || 'Not provided'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                      
                                    {/* Items */}
                                    <div className="px-6 py-6">
                                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">📚</span>
                                        Order Items ({order.orderItems.length})
                                      </h4>
                                      <div className="space-y-4">
                                        {order.orderItems.map((item) => (
                                          <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex-shrink-0">
                                              <img
                                                src={getImgUrl(item.book?.imageLink)}
                                                alt={item.book?.title}
                                                className="w-16 h-20 object-cover rounded-lg border shadow-sm"
                                              />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h5 className="font-semibold text-gray-900 truncate">{item.book?.title}</h5>
                                              <p className="text-sm text-gray-600 mt-1">by {item.book?.author}</p>
                                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center">
                                                  <span className="mr-1">📖</span>
                                                  Category: {item.book?.category}
                                                </span>
                                                <span className="flex items-center">
                                                  <span className="mr-1">🔢</span>
                                                  Qty: {item.quantity}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-lg font-semibold text-gray-900">
                                                ₹{parseFloat(item.price).toFixed(2)}
                                              </div>
                                              <div className="text-sm text-gray-600">
                                                ₹{(parseFloat(item.price) / item.quantity).toFixed(2)} each
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                      
                                    {/* Order Summary */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                                          <div className="flex items-center gap-2">
                                            <span className="text-blue-600">💳</span>
                                            <span className="font-medium text-gray-900">Payment Method:</span>
                                            <span className="text-gray-700 capitalize">{order.paymentMethod}</span>
                                          </div>
                                          {order.isPaid && order.paidAt && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-green-600">✅</span>
                                              <span className="font-medium text-gray-900">Paid on:</span>
                                              <span className="text-gray-700">
                                                {new Date(order.paidAt).toLocaleDateString()}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                                          <div className="text-2xl font-bold text-gray-900">
                                            ₹{order.totalPrice.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                      
                                    {/* Action Buttons */}
                                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                                      <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                        {!order.isPaid && order.status !== 'Cancelled' && (
                                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                            Pay Now
                                          </button>
                                        )}
                                        {order.status === 'Pending' && (
                                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                            Cancel Order
                                          </button>
                                        )}
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                          View Details
                                        </button>
                                        {order.status === 'Delivered' && (
                                          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                                            Leave Review
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      };
                      
export default OrdersPage;