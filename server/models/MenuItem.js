const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);