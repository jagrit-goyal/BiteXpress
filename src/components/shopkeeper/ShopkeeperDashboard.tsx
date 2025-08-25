import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Order, MenuItem } from '../../types';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import { LogOut, User, Package, Menu, Bell, Store } from 'lucide-react';

const ShopkeeperDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Load orders for this shopkeeper
    const allOrders = JSON.parse(localStorage.getItem('BiteXpress_orders') || '[]');
    const shopOrders = allOrders.filter((o: Order) => o.shopkeeperId === user._id);
    setOrders(shopOrders);
    
    // Count pending orders
    const pendingCount = shopOrders.filter((o: Order) => o.status === 'pending').length;
    setPendingOrdersCount(pendingCount);

    // Load menu
    const currentUser = JSON.parse(localStorage.getItem('BiteXpress_user') || '{}');
    if (currentUser.menu) {
      setMenu(currentUser.menu);
    }
  }, [user]);

  const updateMenu = (newMenu: MenuItem[]) => {
    setMenu(newMenu);
    
    // Update user in localStorage
    const currentUser = JSON.parse(localStorage.getItem('BiteXpress_user') || '{}');
    currentUser.menu = newMenu;
    localStorage.setItem('BiteXpress_user', JSON.stringify(currentUser));

    // Update in users list
    const allUsers = JSON.parse(localStorage.getItem('BiteXpress_users') || '[]');
    const userIndex = allUsers.findIndex((u: any) => u._id === user?._id);
    if (userIndex !== -1) {
      allUsers[userIndex].menu = newMenu;
      localStorage.setItem('BiteXpress_users', JSON.stringify(allUsers));
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], estimatedTime?: number) => {
    const allOrders = JSON.parse(localStorage.getItem('BiteXpress_orders') || '[]');
    const orderIndex = allOrders.findIndex((o: Order) => o._id === orderId);
    
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = status;
      if (estimatedTime) {
        allOrders[orderIndex].estimatedTime = estimatedTime;
      }
      localStorage.setItem('BiteXpress_orders', JSON.stringify(allOrders));
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order._id === orderId 
          ? { ...order, status, ...(estimatedTime ? { estimatedTime } : {}) }
          : order
      );
      setOrders(updatedOrders);
      
      // Update pending count
      const pendingCount = updatedOrders.filter(o => o.status === 'pending').length;
      setPendingOrdersCount(pendingCount);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BiteXpress Vendor</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {(user as any).shopName || user.name}!
                </p>
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
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 relative ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Orders</span>
                {pendingOrdersCount > 0 && (
                  <div className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingOrdersCount}
                  </div>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'menu'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Menu className="w-4 h-4" />
                <span>Menu Management</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' && (
          <OrderManagement 
            orders={orders} 
            onUpdateOrderStatus={updateOrderStatus}
          />
        )}

        {activeTab === 'menu' && (
          <MenuManagement 
            menu={menu}
            onUpdateMenu={updateMenu}
          />
        )}
      </main>
    </div>
  );
};

export default ShopkeeperDashboard;