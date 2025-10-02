const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return email.endsWith('@thapar.edu');
      },
      message: 'Please use your Thapar email address (@thapar.edu)'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(rollNumber) {
        return /^\d{9}$/.test(rollNumber);
      },
      message: 'Roll number must be 9 digits'
    }
  },
  hostel: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'PG', 'Q']
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
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  }
}, {
  timestamps: true
});

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);