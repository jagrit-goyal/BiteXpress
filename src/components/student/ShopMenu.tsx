import React, { useState } from 'react';
import { Shopkeeper, MenuItem, OrderItem } from '../../types';
import { ArrowLeft, Plus, Minus, ShoppingCart, MapPin, Clock, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ShopMenuProps {
  shop: Shopkeeper;
  onBack: () => void;
}

const ShopMenu: React.FC<ShopMenuProps> = ({ shop, onBack }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [showCart, setShowCart] = useState(false);

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItemId === menuItem._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.menuItemId === menuItem._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    const existingItem = cart.find(item => item.menuItemId === menuItemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.menuItemId === menuItemId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.menuItemId !== menuItemId));
    }
  };

  const getItemQuantity = (menuItemId: string) => {
    const item = cart.find(item => item.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const order = {
      _id: Date.now().toString(),
      studentId: user?._id || '',
      shopkeeperId: shop._id,
      items: cart,
      totalAmount: getTotalAmount(),
      status: 'pending' as const,
      orderTime: new Date(),
      notes: notes.trim() || undefined,
      studentDetails: {
        name: user?.name || '',
        email: user?.email || '',
        phone: (user as any)?.phone || undefined
      }
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('BiteXpress_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('BiteXpress_orders', JSON.stringify(existingOrders));

    // Clear cart and show success
    setCart([]);
    setNotes('');
    setShowCart(false);
    alert('Order placed successfully! You can track it in your order history.');
  };

  const categories = [...new Set(shop.menu?.map(item => item.category) || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Shops</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{shop.shopName}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>15-20 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>4.5</span>
                  </div>
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>View Cart</span>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Shop Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <p className="text-gray-600">{shop.shopDescription}</p>
        </div>

        {/* Menu */}
        {!shop.menu || shop.menu.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items available</h3>
            <p className="text-gray-600">This shop hasn't added any items to their menu yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shop.menu
                    ?.filter(item => item.category === category)
                    .map(item => (
                      <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-orange-600">₹{item.price}</span>
                            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              item.isAvailable 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </div>
                          </div>
                        </div>

                        {item.isAvailable ? (
                          <div className="flex items-center justify-between">
                            {getItemQuantity(item._id) === 0 ? (
                              <button
                                onClick={() => addToCart(item)}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </button>
                            ) : (
                              <div className="flex-1 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-2">
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-semibold text-orange-700">
                                  {getItemQuantity(item._id)}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded-xl font-semibold cursor-not-allowed"
                          >
                            Currently Unavailable
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Your Order</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.menuItemId} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center transition-colors duration-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium text-gray-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart({ _id: item.menuItemId, name: item.name, price: item.price } as MenuItem)}
                          className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center transition-colors duration-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900 min-w-[60px] text-right">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Any special requests or instructions..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-orange-600">₹{getTotalAmount()}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopMenu;