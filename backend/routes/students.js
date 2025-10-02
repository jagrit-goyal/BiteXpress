const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const student = await req.user.populate('orders');
    res.json({
      id: student._id,
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      hostel: student.hostel,
      phone: student.phone,
      year: student.year,
      branch: student.branch
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;