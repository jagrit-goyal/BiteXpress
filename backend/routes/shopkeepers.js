const express = require('express');
const auth = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const router = express.Router();

// Add menu item
router.post('/menu', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const { name, description, price, category, isVeg, preparationTime } = req.body;

    const menuItem = new MenuItem({
      shopkeeper: req.user._id,
      name,
      description,
      price,
      category,
      isVeg,
      preparationTime
    });

    await menuItem.save();
    res.status(201).json({ message: 'Menu item added successfully', menuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shopkeeper's menu
router.get('/menu', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const menuItems = await MenuItem.find({ shopkeeper: req.user._id })
      .sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update menu item
router.put('/menu/:itemId', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const { itemId } = req.params;
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, shopkeeper: req.user._id },
      req.body,
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated successfully', menuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu item
router.delete('/menu/:itemId', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const { itemId } = req.params;
    const menuItem = await MenuItem.findOneAndDelete({ 
      _id: itemId, 
      shopkeeper: req.user._id 
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders for shopkeeper
router.get('/orders', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const orders = await Order.find({ shopkeeper: req.user._id })
      .populate('student', 'name rollNumber hostel phone')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:orderId/status', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const { orderId } = req.params;
    const { status, rejectionReason } = req.body;

    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, shopkeeper: req.user._id },
      updateData,
      { new: true }
    ).populate('student', 'name rollNumber');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;