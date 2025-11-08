const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  try {

    const token = req.cookies.AdminAuthToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN || 'fallback-admin-secret');
    req.admin = decoded;
    req.adminId = decoded.id; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = userAuth;