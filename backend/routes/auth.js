const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Shopkeeper = require('../models/Shopkeeper');

const router = express.Router();

// Student Registration
router.post('/register/student', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('rollNumber').isLength({ min: 9, max: 9 }).withMessage('Roll number must be 9 digits'),
  body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, rollNumber, hostel, phone, year, branch } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or roll number already exists' });
    }

    const student = new Student({
      name, email, password, rollNumber, hostel, phone, year, branch
    });

    await student.save();

    const token = jwt.sign(
      { id: student._id, userType: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        userType: 'student'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Shopkeeper Registration
router.post('/register/shopkeeper', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
  body('shopName').notEmpty().withMessage('Shop name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, phone, shopName, shopLocation, shopType } = req.body;

    // Check if shopkeeper already exists
    const existingShopkeeper = await Shopkeeper.findOne({ $or: [{ email }, { shopName }] });
    if (existingShopkeeper) {
      return res.status(400).json({ message: 'Shopkeeper with this email or shop name already exists' });
    }

    const shopkeeper = new Shopkeeper({
      name, email, password, phone, shopName, shopLocation, shopType
    });

    await shopkeeper.save();

    const token = jwt.sign(
      { id: shopkeeper._id, userType: 'shopkeeper' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Shopkeeper registered successfully',
      token,
      user: {
        id: shopkeeper._id,
        name: shopkeeper.name,
        email: shopkeeper.email,
        shopName: shopkeeper.shopName,
        userType: 'shopkeeper'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userType').isIn(['student', 'shopkeeper']).withMessage('Invalid user type'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password, userType } = req.body;

    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else {
      user = await Shopkeeper.findOne({ email });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType
    };

    if (userType === 'shopkeeper') {
      userResponse.shopName = user.shopName;
      userResponse.isVerified = user.isVerified;
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;