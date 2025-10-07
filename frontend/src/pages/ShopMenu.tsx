import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Clock,
  MapPin,
  Leaf
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  preparationTime: number;
}

interface Shop {
  _id: string;
  shopName: string;
  shopLocation: string;
  shopType: string;
  name: string;
  deliveryFee: number;
  minimumOrderAmount: number;
  freeDeliveryAbove: number | null;
}

const ShopMenu = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);

  const { items, addItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  const calculateDeliveryFee = () => {
    if (!shop) return 0;
    
    const subtotal = getTotalPrice();
    
    // If no delivery fee set, always free
    if (shop.deliveryFee === 0) return 0;
    
    // Free delivery above threshold
    if (shop.freeDeliveryAbove && subtotal >= shop.freeDeliveryAbove) {
      return 0;
    }
    
    // Apply delivery fee to all orders (unless free delivery above threshold)
    return shop.deliveryFee;
  };

  useEffect(() => {
    fetchShopData();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      const [menuRes, shopsRes] = await Promise.all([
        axios.get(`/api/shops/${shopId}/menu`),
        axios.get('/api/shops')
      ]);
      
      setMenuItems(menuRes.data);
      const shopData = shopsRes.data.find((s: Shop) => s._id === shopId);
      setShop(shopData);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const subtotal = getTotalPrice();
    
    // Check minimum order amount
    if (shop && shop.minimumOrderAmount > 0 && subtotal < shop.minimumOrderAmount) {
      toast.error(`Minimum order amount is ₹${shop.minimumOrderAmount}. Please add more items to your cart.`);
      return;
    }

    const orderItems = items.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity
    }));

    try {
      const deliveryFee = calculateDeliveryFee();
      
      const response = await axios.post('/api/orders', {
        shopkeeperId: shopId,
        items: orderItems,
        deliveryInstructions: '',
        subtotal: subtotal,
        deliveryFee: deliveryFee
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      setShowCart(false);
      
      // Redirect to order tracking page
      navigate(`/order/${response.data.order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  const categorizedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (shop && (shop as any).isOpen === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">This shop is currently closed</h2>
          <Link to="/student" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop not found</h2>
          <Link to="/student" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/student"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{shop.shopName}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{shop.shopLocation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {shop.shopType}
                </span>
              </div>
              <p className="text-gray-600">by {shop.name}</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-8">
          {Object.entries(categorizedItems).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((item, itemIndex) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <div className={`w-4 h-4 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center`}>
                            {item.isVeg && <Leaf className="h-3 w-3 text-white" />}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.preparationTime} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                      
                      <div className="flex items-center space-x-3">
                        {quantities[item._id] > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, quantities[item._id] - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium">{quantities[item._id]}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, quantities[item._id] + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    {calculateDeliveryFee() > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Delivery Fee:</span>
                        <span>₹{calculateDeliveryFee()}</span>
                      </div>
                    )}
                    {calculateDeliveryFee() === 0 && shop?.deliveryFee > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Delivery Fee:</span>
                        <span>FREE</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>₹{getTotalPrice() + calculateDeliveryFee()}</span>
                    </div>
                  </div>
                  
                  {/* Minimum Order Amount Warning */}
                  {shop && shop.minimumOrderAmount > 0 && getTotalPrice() < shop.minimumOrderAmount && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Minimum order: ₹{shop.minimumOrderAmount}</span>
                        <br />
                        Add ₹{shop.minimumOrderAmount - getTotalPrice()} more to place order
                      </p>
                    </div>
                  )}
                  
                  {/* Free Delivery Message */}
                  {shop && shop.freeDeliveryAbove && shop.deliveryFee > 0 && getTotalPrice() < shop.freeDeliveryAbove && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">🎉 Add ₹{shop.freeDeliveryAbove - getTotalPrice()} more for FREE delivery!</span>
                        <br />
                        <span className="text-xs">Order above ₹{shop.freeDeliveryAbove} to save ₹{shop.deliveryFee} on delivery</span>
                      </p>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-2">Payment: Cash only</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={shop && shop.minimumOrderAmount > 0 && getTotalPrice() < shop.minimumOrderAmount}
                    className={`w-full py-3 rounded-lg transition-colors font-semibold ${
                      shop && shop.minimumOrderAmount > 0 && getTotalPrice() < shop.minimumOrderAmount
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {shop && shop.minimumOrderAmount > 0 && getTotalPrice() < shop.minimumOrderAmount
                      ? `Add ₹${shop.minimumOrderAmount - getTotalPrice()} more to order`
                      : 'Place Order'
                    }
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopMenu;