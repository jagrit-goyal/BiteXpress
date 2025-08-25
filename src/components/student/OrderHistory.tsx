import React from 'react';
import { Order } from '../../types';
import { Clock, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
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

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600">Your order history will appear here once you place your first order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
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
              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
            </div>
          )}

          {/* Order Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-lg font-bold text-orange-600">₹{order.totalAmount}</span>
          </div>

          {/* Estimated Time */}
          {order.estimatedTime && order.status === 'accepted' && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {order.estimatedTime} minutes</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;