const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Only students can place orders' });
    }

    const order = new Order({
      ...req.body,
      studentId: req.user._id,
      deliveryAddress: req.user.hostel
    });

    await order.save();
    await order.populate('studentId shopkeeperId');
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders for student
router.get('/my-orders', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ studentId: req.user._id })
      .populate('shopkeeperId', 'shopName')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders for shopkeeper
router.get('/shop-orders', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ shopkeeperId: req.user._id })
      .populate('studentId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, estimatedTime } = req.body;
    
    const order = await Order.findOne({ 
      _id: req.params.id, 
      shopkeeperId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (estimatedTime) {
      order.estimatedTime = estimatedTime;
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;