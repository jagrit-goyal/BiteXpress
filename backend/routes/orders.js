const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Shopkeeper = require('../models/Shopkeeper');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const { shopkeeperId, items, deliveryInstructions } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Item ${menuItem?.name || 'Unknown'} is not available` });
      }
      
      if (menuItem.shopkeeper.toString() !== shopkeeperId) {
        return res.status(400).json({ message: 'All items must be from the same shop' });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Get shopkeeper details for delivery fee calculation
    const shopkeeper = await Shopkeeper.findById(shopkeeperId);
    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    if (shopkeeper.deliveryFee > 0) {
      if (shopkeeper.freeDeliveryAbove && totalAmount >= shopkeeper.freeDeliveryAbove) {
        deliveryFee = 0; // Free delivery above threshold
      } else {
        deliveryFee = shopkeeper.deliveryFee; // Apply delivery fee to all other orders
      }
    }

    const finalTotal = totalAmount + deliveryFee;

    const order = new Order({
      student: req.user._id,
      shopkeeper: shopkeeperId,
      items: orderItems,
      totalAmount: finalTotal,
      subtotal: totalAmount,
      deliveryFee: deliveryFee,
      deliveryInstructions
    });

    await order.save();
    await order.populate([
      { path: 'shopkeeper', select: 'shopName' },
      { path: 'items.menuItem', select: 'name price' }
    ]);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const orders = await Order.find({ student: req.user._id })
      .populate('shopkeeper', 'shopName shopLocation')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    let query = { _id: orderId };
    if (req.userType === 'student') {
      query.student = req.user._id;
    } else if (req.userType === 'shopkeeper') {
      query.shopkeeper = req.user._id;
    }

    const order = await Order.findOne(query)
      .populate('student', 'name rollNumber hostel phone')
      .populate('shopkeeper', 'shopName shopLocation')
      .populate('items.menuItem', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (students only)
router.put('/:orderId/cancel', auth, async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const { orderId } = req.params;
    const order = await Order.findOne({ 
      _id: orderId, 
      student: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;