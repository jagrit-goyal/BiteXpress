const express = require('express');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Get menu items for a shopkeeper
router.get('/shop/:shopkeeperId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ shopkeeperId: req.params.shopkeeperId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all menu items for current shopkeeper
router.get('/my-menu', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const menuItems = await MenuItem.find({ shopkeeperId: req.user._id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add menu item
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const menuItem = new MenuItem({
      ...req.body,
      shopkeeperId: req.user._id
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item
router.put('/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({ 
      _id: req.params.id, 
      shopkeeperId: req.user._id 
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    Object.assign(menuItem, req.body);
    await menuItem.save();
    
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item
router.delete('/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({ 
      _id: req.params.id, 
      shopkeeperId: req.user._id 
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;