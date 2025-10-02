const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const shopkeeperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(phone) {
        return /^\d{10}$/.test(phone);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  shopLocation: {
    type: String,
    required: true,
    enum: ['Campus', 'Gate 1', 'Gate 2', 'Hostel Area', 'Academic Block', 'Food Court']
  },
  shopType: {
    type: String,
    required: true,
    enum: ['Fast Food', 'Indian', 'Chinese', 'South Indian', 'Beverages', 'Snacks', 'Desserts']
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

shopkeeperSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

shopkeeperSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Shopkeeper', shopkeeperSchema);