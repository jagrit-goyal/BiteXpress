const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'completed', 'rejected'],
    default: 'pending'
  },
  estimatedTime: Number,
  notes: String,
  deliveryAddress: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);