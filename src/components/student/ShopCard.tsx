import React from 'react';
import { Shopkeeper } from '../../types';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';

interface ShopCardProps {
  shop: Shopkeeper;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const handleShopClick = () => {
    // Navigate to shop menu (would be implemented with routing)
    console.log('Navigate to shop:', shop._id);
  };

  return (
    <div 
      onClick={handleShopClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
    >
      {/* Shop Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Open
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
              {shop.shopName}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {shop.shopDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{shop.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>15-20 min</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg">
          <span>View Menu</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

export default ShopCard;