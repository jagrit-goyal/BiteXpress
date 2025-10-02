const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopkeeper',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Main Course', 'Starters', 'Beverages', 'Desserts', 'Snacks']
  },
  isVeg: {
    type: Boolean,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 5,
    max: 60
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);