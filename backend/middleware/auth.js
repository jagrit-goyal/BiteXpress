const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Shopkeeper = require('../models/Shopkeeper');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType === 'student') {
      const student = await Student.findById(decoded.id);
      if (!student) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      req.user = student;
      req.userType = 'student';
    } else if (decoded.userType === 'shopkeeper') {
      const shopkeeper = await Shopkeeper.findById(decoded.id);
      if (!shopkeeper) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      req.user = shopkeeper;
      req.userType = 'shopkeeper';
    } else {
      return res.status(401).json({ message: 'Invalid user type.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;