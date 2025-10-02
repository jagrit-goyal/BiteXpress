const express = require('express');
const auth = require('../middleware/auth');
const Shopkeeper = require('../models/Shopkeeper');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get all active shops
router.get('/', async (req, res) => {
  try {
    const shops = await Shopkeeper.find({ isActive: true, isVerified: true })
      .select('-password')
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
    }).populate('shopkeeper', 'shopName shopType');
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;