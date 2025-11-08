const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    //not from header i want it from token
    const token = req.cookies.footsalAuthToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_FOOTSAL || 'fallback_footsal_secret');
    req.footsal = decoded;
    req.footsalId = decoded.id;
    req.footsalCode = decoded.footsalCode // Attach user ID to request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;