const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'BiteXpress - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">BiteXpress - Email Verification</h2>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userType, ...otherFields } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP for students
    let otp = null;
    let otpExpires = null;
    
    if (userType === 'student') {
      otp = crypto.randomInt(100000, 999999).toString();
      otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      userType,
      ...otherFields,
      emailVerificationOTP: otp,
      otpExpires,
      isEmailVerified: userType === 'shopkeeper' // Auto-verify shopkeepers
    });

    await user.save();

    // Send OTP email for students
    if (userType === 'student' && otp) {
      await sendOTPEmail(email, otp);
    }

    res.status(201).json({
      message: userType === 'student' 
        ? 'Registration successful. Please verify your email.' 
        : 'Registration successful',
      requiresVerification: userType === 'student'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email, 
      emailVerificationOTP: otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        rollNumber: user.rollNumber,
        hostel: user.hostel,
        shopName: user.shopName,
        shopDescription: user.shopDescription,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.userType === 'student' && !user.isEmailVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        rollNumber: user.rollNumber,
        hostel: user.hostel,
        shopName: user.shopName,
        shopDescription: user.shopDescription,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      userType: req.user.userType,
      rollNumber: req.user.rollNumber,
      hostel: req.user.hostel,
      shopName: req.user.shopName,
      shopDescription: req.user.shopDescription,
      location: req.user.location
    }
  });
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        rollNumber: user.rollNumber,
        hostel: user.hostel,
        shopName: user.shopName,
        shopDescription: user.shopDescription,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;