import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus, CreditCard as Edit, Trash2, LogOut, User, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number;
}

interface Order {
  _id: string;
  student: {
    name: string;
    rollNumber: string;
    hostel: string;
    phone: string;
  };
  items: Array<{
    menuItem: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryInstructions?: string;
}

const ShopkeeperDashboard = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'profile'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<{ 
    name: string; 
    phone: string; 
    shopName: string; 
    shopLocation: string; 
    shopType: string; 
    shopImage?: string | null;
    deliveryFee: number;
    minimumOrderAmount: number;
    freeDeliveryAbove: number | null;
  } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVeg: true,
    preparationTime: '15'
  });

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        axios.get('/api/shopkeepers/menu'),
        axios.get('/api/shopkeepers/orders')
      ]);
      setMenuItems(menuRes.data);
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
      const res = await axios.get('/api/shopkeepers/me');
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await axios.put('/api/shopkeepers/profile', {
        name: profile.name,
        phone: profile.phone,
        shopName: profile.shopName,
        shopLocation: profile.shopLocation,
        shopType: profile.shopType,
        deliveryFee: profile.deliveryFee,
        minimumOrderAmount: profile.minimumOrderAmount,
        freeDeliveryAbove: profile.freeDeliveryAbove
      });
      toast.success('Profile updated');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }
    try {
      const form = new FormData();
      form.append('shopImage', imageFile);
      const res = await axios.post('/api/shopkeepers/image', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Image uploaded');
      setImageFile(null);
      setProfile(prev => prev ? { ...prev, shopImage: res.data.shopImage } : prev);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/shopkeepers/menu', {
        ...itemForm,
        price: parseFloat(itemForm.price),
        preparationTime: parseInt(itemForm.preparationTime)
      });
      toast.success('Menu item added successfully');
      setShowAddItem(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await axios.put(`/api/shopkeepers/menu/${editingItem._id}`, {
        ...itemForm,
        price: parseFloat(itemForm.price),
        preparationTime: parseInt(itemForm.preparationTime)
      });
      toast.success('Menu item updated successfully');
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update menu item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/api/shopkeepers/menu/${itemId}`);
      toast.success('Menu item deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string, rejectionReason?: string) => {
    try {
      await axios.put(`/api/shopkeepers/orders/${orderId}/status`, { 
        status, 
        rejectionReason 
      });
      toast.success(`Order ${status} successfully`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const resetForm = () => {
    setItemForm({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      isVeg: true,
      preparationTime: '15'
    });
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      preparationTime: item.preparationTime.toString()
    });
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const activeOrders = orders.filter(order => ['accepted', 'preparing', 'ready'].includes(order.status));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-accent-600" />
              <h1 className="text-2xl font-bold text-gray-900">BiteXpress</h1>
              <span className="text-sm text-gray-500 ml-4">Shop Owner Panel</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user?.shopName}</span>
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
            Manage your shop, menu, and orders from your dashboard.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Orders</p>
                <p className="text-2xl font-bold text-blue-600">{activeOrders.length}</p>
              </div>
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Menu Items</p>
                <p className="text-2xl font-bold text-green-600">{menuItems.length}</p>
              </div>
              <ShoppingBag className="h-10 w-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Orders will appear here when students place them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Order #{order._id.slice(-8)}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {order.student.name} • {order.student.rollNumber} • {order.student.hostel}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-900 block mb-2">
                          ₹{order.totalAmount}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Items:</h5>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.deliveryInstructions && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Instructions:</strong> {order.deliveryInstructions}
                        </p>
                      </div>
                    )}

                    {order.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOrderStatusUpdate(order._id, 'accepted')}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for rejection (optional):');
                            handleOrderStatusUpdate(order._id, 'rejected', reason || undefined);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleOrderStatusUpdate(order._id, 'preparing')}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleOrderStatusUpdate(order._id, 'ready')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleOrderStatusUpdate(order._id, 'delivered')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Details</h3>
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={profile.shopName}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, shopName: e.target.value } : prev)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={profile.shopLocation}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, shopLocation: e.target.value } : prev)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={profile.shopType}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, shopType: e.target.value } : prev)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : prev)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700">Save Changes</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h3>
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                  <input
                    type="text"
                    value={profile.deliveryFee}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, deliveryFee: parseFloat(e.target.value) || 0 } : prev)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for free delivery</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                  <input
                    type="text"
                    value={profile.minimumOrderAmount}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, minimumOrderAmount: parseFloat(e.target.value) || 0 } : prev)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Orders below this amount will have delivery fee applied</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Delivery Above (₹)</label>
                  <input
                    type="text"
                    value={profile.freeDeliveryAbove || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, freeDeliveryAbove: e.target.value ? parseFloat(e.target.value) : null } : prev)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Leave empty for no free delivery threshold"
                  />
                  <p className="text-xs text-gray-500 mt-1">Orders above this amount get free delivery</p>
                </div>
                <button type="submit" className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700">Save Delivery Settings</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Image</h3>
              <div className="mb-4">
                {profile.shopImage ? (
                  <img src={profile.shopImage} alt="Shop" className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <form onSubmit={uploadImage} className="space-y-3">
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                <button type="submit" className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700">Upload Image</button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Menu Items</h3>
              <button
                onClick={() => {
                  setShowAddItem(true);
                  resetForm();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add/Edit Item Modal */}
            {(showAddItem || editingItem) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h4>
                  
                  <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={itemForm.name}
                        onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        placeholder="e.g., Chicken Biryani"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={itemForm.description}
                        onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        placeholder="Describe your delicious dish..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={itemForm.price}
                          onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prep Time (min) *
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={itemForm.preparationTime}
                          onChange={(e) => setItemForm(prev => ({ ...prev, preparationTime: e.target.value }))}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={itemForm.category}
                        onChange={(e) => setItemForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      >
                        <option value="Main Course">Main Course</option>
                        <option value="Starters">Starters</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isVeg"
                        checked={itemForm.isVeg}
                        onChange={(e) => setItemForm(prev => ({ ...prev, isVeg: e.target.checked }))}
                        className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isVeg" className="ml-2 block text-sm text-gray-700">
                        Vegetarian
                      </label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium"
                      >
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddItem(false);
                          setEditingItem(null);
                          resetForm();
                        }}
                        className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Menu Items List */}
            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items</h3>
                <p className="text-gray-600">Add your first menu item to get started.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1 text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {item.preparationTime}min
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600">{item.category}</span>
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

export default ShopkeeperDashboard;