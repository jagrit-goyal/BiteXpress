import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Store, MapPin, Clock, Star, LogOut, User, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { UPLOADS_BASE_URL } from '../config/api';

interface Shop {
  _id: string;
  shopName: string;
  shopLocation: string;
  shopType: string;
  name: string;
  shopImage?: string | null;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shopkeeper: {
    shopName: string;
  };
}

const StudentDashboard = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'shops' | 'orders' | 'profile'>('shops');
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const [profile, setProfile] = useState({ name: '', phone: '', hostel: '', year: '' });

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, []);

  const fetchData = async () => {
    try {
      const [shopsRes, ordersRes] = await Promise.all([
        axios.get('/api/shops'),
        axios.get('/api/orders/my-orders')
      ]);
      setShops(shopsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/students/profile');
      setProfile({
        name: res.data.name || '',
        phone: res.data.phone || '',
        hostel: res.data.hostel || '',
        year: String(res.data.year || '')
      });
    } catch (error) {
      // ignore for now
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/students/profile', {
        name: profile.name,
        phone: profile.phone,
        hostel: profile.hostel,
        year: Number(profile.year)
      });
      toast.success('Profile updated');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">BiteXpress</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {getTotalItems() > 0 && (
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Ready to order some delicious food from campus shops?
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('shops')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shops'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Shops
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Shops Tab */}
        {activeTab === 'shops' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {shops.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops available</h3>
                <p className="text-gray-600">Check back later for available shops on campus.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop, index) => (
                  <motion.div
                    key={shop._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      {shop.shopImage ? (
                        <img
                          src={shop.shopImage.startsWith('http') ? shop.shopImage : `${UPLOADS_BASE_URL}${shop.shopImage}`}
                          alt={shop.shopName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                          <Store className="h-16 w-16 text-white/80" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {shop.shopType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.shopName}</h3>
                      <p className="text-gray-600 mb-4">by {shop.name}</p>
                      
                      <div className="flex items-center text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{shop.shopLocation}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                        <Link
                          to={`/shop/${shop._id}`}
                          className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors font-medium"
                        >
                          View Menu
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h3>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
                  <select
                    value={profile.hostel}
                    onChange={(e) => setProfile(prev => ({ ...prev, hostel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Hostel</option>
                    {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','PG','Q'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={profile.year}
                    onChange={(e) => setProfile(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Changes</button>
            </form>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Place your first order from any of the campus shops!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {order.shopkeeper.shopName}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{order.totalAmount}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </div>
                        <Link
                          to={`/order/${order._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                        >
                          Track Order →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;