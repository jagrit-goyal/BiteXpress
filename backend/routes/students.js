const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const student = req.user;
    res.json({
      id: student._id,
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      hostel: student.hostel,
      phone: student.phone,
      year: student.year
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const allowed = ['name', 'hostel', 'phone', 'year'];
    const update = {};
    for (const key of allowed) {
      if (typeof req.body[key] !== 'undefined') update[key] = req.body[key];
    }

    Object.assign(req.user, update);
    await req.user.save();

    res.json({
      message: 'Profile updated',
      profile: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rollNumber: req.user.rollNumber,
        hostel: req.user.hostel,
        phone: req.user.phone,
        year: req.user.year
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;