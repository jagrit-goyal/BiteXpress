const express = require('express');
const auth = require('../middleware/auth');
const Shopkeeper = require('../models/Shopkeeper');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get all active shops
router.get('/', async (req, res) => {
  try {
    const shops = await Shopkeeper.find({ isActive: true })
      .select('name email phone shopName shopLocation shopType shopImage isVerified isActive deliveryFee minimumOrderAmount freeDeliveryAbove')
      .sort({ shopName: 1 });
    
    res.json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop menu
router.get('/:shopId/menu', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const menuItems = await MenuItem.find({ 
      shopkeeper: shopId, 
      isAvailable: true 
    }).populate('shopkeeper', 'shopName shopType shopLocation');
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;