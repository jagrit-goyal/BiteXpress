import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shopkeeper, Order } from '../../types';
import ShopCard from './ShopCard';
import OrderHistory from './OrderHistory';
import ShopMenu from './ShopMenu';
import { LogOut, User, Clock, ShoppingBag, MapPin, Edit } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'shops' | 'orders' | 'profile'>('shops');
  const [shops, setShops] = useState<Shopkeeper[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shopkeeper | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    // Load shops and orders from localStorage (mock data)
    const mockShops = JSON.parse(localStorage.getItem('BiteXpress_users') || '[]')
      .filter((u: any) => u.userType === 'shopkeeper');
    setShops(mockShops);

    const mockOrders = JSON.parse(localStorage.getItem('BiteXpress_orders') || '[]')
      .filter((o: Order) => o.studentId === user?._id);
    setOrders(mockOrders);
  }, [user?._id]);

  const handleShopSelect = (shop: Shopkeeper) => {
    setSelectedShop(shop);
  };

  const handleBackToShops = () => {
    setSelectedShop(null);
  };

  const handleUpdateAddress = () => {
    if (newAddress.trim()) {
      // Update user address in localStorage
      const currentUser = JSON.parse(localStorage.getItem('BiteXpress_user') || '{}');
      currentUser.hostel = newAddress;
      localStorage.setItem('BiteXpress_user', JSON.stringify(currentUser));

      // Update in users list
      const allUsers = JSON.parse(localStorage.getItem('BiteXpress_users') || '[]');
      const userIndex = allUsers.findIndex((u: any) => u._id === user?._id);
      if (userIndex !== -1) {
        allUsers[userIndex].hostel = newAddress;
        localStorage.setItem('BiteXpress_users', JSON.stringify(allUsers));
      }

      setShowAddressModal(false);
      setNewAddress('');
      
      // Refresh the page to show updated address
      window.location.reload();
    }
  };

  if (!user) return null;

  // If a shop is selected, show the shop menu
  if (selectedShop) {
    return <ShopMenu shop={selectedShop} onBack={handleBackToShops} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BiteXpress</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('shops')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'shops'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Shops</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'orders'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Order History</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'shops' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Shops</h2>
              <p className="text-gray-600">Choose from our verified campus vendors</p>
            </div>

            {shops.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops available</h3>
                <p className="text-gray-600">Check back later for new vendors!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shops.map((shop) => (
                  <div key={shop._id} onClick={() => handleShopSelect(shop)}>
                    <ShopCard shop={shop} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Order History</h2>
              <p className="text-gray-600">Track your past and current orders</p>
            </div>
            <OrderHistory orders={orders} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h2>
              <p className="text-gray-600">Manage your account information</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={(user as any).rollNumber || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 flex items-center space-x-3 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        {(user as any).hostel || 'No address set'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setNewAddress((user as any).hostel || '');
                        setShowAddressModal(true);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Address Update Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Update Delivery Address</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hostel/Address
              </label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your hostel name or address"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleUpdateAddress}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
              >
                Update Address
              </button>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setNewAddress('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;