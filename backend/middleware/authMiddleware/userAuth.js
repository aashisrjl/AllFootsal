const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.userAuthToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER || 'fallback-user-secret');
    req.user = decoded;
    req.userId = decoded.id; // Attach user ID to request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = userAuth;