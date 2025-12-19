const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Admin auth - Token received:', !!token);
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Admin auth - Token decoded for user:', decoded.userId);
    
    const user = await User.findById(decoded.userId);
    console.log('Admin auth - User found:', user?.email, 'Role:', user?.role);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = adminAuth;