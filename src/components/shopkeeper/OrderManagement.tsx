import React from 'react';
import { Order } from '../../types';
import { Clock, CheckCircle, XCircle, AlertCircle, Package, Phone, Mail } from 'lucide-react';

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], estimatedTime?: number) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onUpdateOrderStatus }) => {
  const handleAcceptOrder = (orderId: string) => {
    const estimatedTime = prompt('Enter estimated preparation time (in minutes):');
    if (estimatedTime) {
      const time = parseInt(estimatedTime, 10);
      if (time > 0) {
        onUpdateOrderStatus(orderId, 'accepted', time);
      }
    }
  };

  const handleRejectOrder = (orderId: string) => {
    if (confirm('Are you sure you want to reject this order?')) {
      onUpdateOrderStatus(orderId, 'rejected');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'ready':
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Sort orders: pending first, then by time
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
        <p className="text-gray-600">Manage incoming orders and track their status</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">New orders will appear here when students place them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderTime).toLocaleDateString()} at{' '}
                      {new Date(order.orderTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Details:</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{order.studentDetails.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{order.studentDetails.email}</span>
                  </div>
                  {order.studentDetails.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{order.studentDetails.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-600">x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</h4>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Order Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-4">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">₹{order.totalAmount}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order._id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                    >
                      Reject Order
                    </button>
                  </>
                )}
                
                {order.status === 'accepted' && (
                  <button
                    onClick={() => onUpdateOrderStatus(order._id, 'preparing')}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Start Preparing
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button
                    onClick={() => onUpdateOrderStatus(order._id, 'ready')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Mark as Ready
                  </button>
                )}
                
                {order.status === 'ready' && (
                  <button
                    onClick={() => onUpdateOrderStatus(order._id, 'completed')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              {/* Estimated Time Display */}
              {order.estimatedTime && (order.status === 'accepted' || order.status === 'preparing') && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated time: {order.estimatedTime} minutes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;