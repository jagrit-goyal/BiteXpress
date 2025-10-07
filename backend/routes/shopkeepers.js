const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Shopkeeper = require('../models/Shopkeeper');

const router = express.Router();

// Multer config for updating shop image
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9-_\.]/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});
const upload = multer({ storage });

// Update shop image
router.post('/image', auth, upload.single('shopImage'), async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    if (!imagePath) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const updated = await Shopkeeper.findByIdAndUpdate(
      req.user._id,
      { shopImage: imagePath },
      { new: true }
    ).select('shopName shopImage');

    res.json({ message: 'Shop image updated', shopImage: updated.shopImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get own profile (shopkeeper)
router.get('/me', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const shopkeeper = await Shopkeeper.findById(req.user._id)
      .select('name email phone shopName shopLocation shopType shopImage isVerified deliveryFee minimumOrderAmount freeDeliveryAbove');
    res.json(shopkeeper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile details (without image)
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'shopkeeper') {
      return res.status(403).json({ message: 'Access denied. Shopkeepers only.' });
    }

    const allowed = ['name', 'phone', 'shopName', 'shopLocation', 'shopType', 'deliveryFee', 'minimumOrderAmount', 'freeDeliveryAbove', 'isOpen'];
    const update = {};
    for (const key of allowed) {
      if (typeof req.body[key] !== 'undefined') update[key] = req.body[key];
    }

    const updated = await Shopkeeper.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    )
      .select('name email phone shopName shopLocation shopType shopImage isVerified deliveryFee minimumOrderAmount freeDeliveryAbove isOpen');

    res.json({ message: 'Profile updated', profile: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

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