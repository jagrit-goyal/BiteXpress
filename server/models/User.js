const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'shopkeeper'],
    required: true
  },
  phone: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: String,
  otpExpires: Date,
  
  // Student specific fields
  rollNumber: String,
  hostel: String,
  
  // Shopkeeper specific fields
  shopName: String,
  shopDescription: String,
  location: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);