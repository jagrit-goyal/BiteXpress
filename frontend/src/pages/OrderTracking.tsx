import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, MapPin, Phone, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  menuItem: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  student: {
    name: string;
    rollNumber: string;
    hostel: string;
    phone: string;
  };
  shopkeeper: {
    shopName: string;
    shopLocation: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryInstructions?: string;
  rejectionReason?: string;
}

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrder();
    
    // Poll for order updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.put(`/api/orders/${order._id}/cancel`);
        toast.success('Order cancelled successfully');
        // Refresh the order to show updated status
        fetchOrder();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'text-yellow-600 bg-yellow-100',
          icon: Clock,
          message: 'Waiting for shop owner to accept your order'
        };
      case 'accepted':
        return {
          color: 'text-blue-600 bg-blue-100',
          icon: CheckCircle,
          message: 'Order accepted! Preparation will start soon'
        };
      case 'preparing':
        return {
          color: 'text-orange-600 bg-orange-100',
          icon: Package,
          message: 'Your order is being prepared'
        };
      case 'ready':
        return {
          color: 'text-green-600 bg-green-100',
          icon: CheckCircle,
          message: 'Order is ready for pickup!'
        };
      case 'delivered':
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: CheckCircle,
          message: 'Order delivered successfully'
        };
      case 'rejected':
        return {
          color: 'text-red-600 bg-red-100',
          icon: XCircle,
          message: 'Order was rejected by the shop owner'
        };
      case 'cancelled':
        return {
          color: 'text-red-600 bg-red-100',
          icon: XCircle,
          message: 'Order was cancelled'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: Clock,
          message: 'Order status unknown'
        };
    }
  };

  const getProgressSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', active: false, completed: false },
      { key: 'accepted', label: 'Accepted', active: false, completed: false },
      { key: 'preparing', label: 'Preparing', active: false, completed: false },
      { key: 'ready', label: 'Ready', active: false, completed: false },
      { key: 'delivered', label: 'Delivered', active: false, completed: false }
    ];

    const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
      steps[0].completed = true;
      return steps;
    }

    steps.forEach((step, index) => {
      if (index < currentIndex) {
        step.completed = true;
      } else if (index === currentIndex) {
        step.active = true;
      }
    });

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link 
            to={user?.userType === 'student' ? '/student' : '/shopkeeper'} 
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const progressSteps = getProgressSteps(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              to={user?.userType === 'student' ? '/student' : '/shopkeeper'}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order._id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ₹{order.totalAmount}
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${statusInfo.color}`}>
                <StatusIcon className="h-5 w-5" />
                <span className="font-medium">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-800 font-medium">{statusInfo.message}</p>
            {order.rejectionReason && (
              <p className="text-red-600 mt-2">
                <strong>Reason:</strong> {order.rejectionReason}
              </p>
            )}
          </div>

          {/* Cancel Order Button - Only for students when order is pending */}
          {user?.userType === 'student' && order.status === 'pending' && (
            <div className="mb-6">
              <button
                onClick={handleCancelOrder}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel Order</span>
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {order.status !== 'rejected' && order.status !== 'cancelled' && (
            <div className="mb-6">
              <div className="flex justify-between">
                {progressSteps.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.active 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex mt-4">
                {progressSteps.slice(0, -1).map((step, index) => (
                  <div key={index} className="flex-1">
                    <div className={`h-1 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shop & Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{order.shopkeeper.shopName}</p>
                  <p className="text-gray-600 text-sm">{order.shopkeeper.shopLocation}</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {order.deliveryInstructions && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Delivery Instructions:</p>
                <p className="text-gray-700">{order.deliveryInstructions}</p>
              </div>
            )}
          </motion.div>

          {/* Customer Details (for shopkeeper) */}
          {user?.userType === 'shopkeeper' && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{order.student.name}</p>
                    <p className="text-gray-600 text-sm">Roll: {order.student.rollNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">{order.student.hostel}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">{order.student.phone}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Student Details (for student) */}
          {user?.userType === 'student' && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Total</span>
                  <span className="font-medium">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-xl text-gray-900">₹{order.totalAmount}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Payment Method: Cash on Pickup
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;