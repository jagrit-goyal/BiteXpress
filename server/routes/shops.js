const express = require('express');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get all verified shops
router.get('/', async (req, res) => {
  try {
    const shops = await User.find({ 
      userType: 'shopkeeper',
      isVerified: true 
    }).select('-password -emailVerificationOTP -otpExpires');
    
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get shop details with menu
router.get('/:id', async (req, res) => {
  try {
    const shop = await User.findOne({ 
      _id: req.params.id, 
      userType: 'shopkeeper' 
    }).select('-password -emailVerificationOTP -otpExpires');
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const menu = await MenuItem.find({ shopkeeperId: shop._id });
    
    res.json({
      ...shop.toObject(),
      menu
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;