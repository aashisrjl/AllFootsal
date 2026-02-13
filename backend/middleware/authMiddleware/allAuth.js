const jwt = require('jsonwebtoken');

const allAuth = (req, res, next) => {
  try {
    const tokenuser = req.cookies.userAuthToken || req.header('Authorization')?.replace('Bearer ', '');
    const tokenfutsal = req.cookies.futsalAuthToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!tokenuser && !tokenfutsal) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if(tokenuser && !tokenfutsal){
      const decoded = jwt.verify(tokenuser, process.env.JWT_SECRET_USER || 'fallback-user-secret');
      req.user = decoded;
      req.userId = decoded.id;
      return next();
    }

    if(tokenfutsal && !tokenuser){
      const decoded = jwt.verify(tokenfutsal, process.env.JWT_SECRET_FUTSAL || 'fallback-footsal-secret');
      req.footsal = decoded;
      req.footsalId = decoded.id;
      req.futsalcode = decoded.code;
      return next();
    }

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = allAuth;