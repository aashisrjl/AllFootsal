const jwt = require("jsonwebtoken");

// Optional user auth - extracts userId if utoken present, silently continues if missing/invalid
const optionalUserAuth = (req, res, next) => {
  try {
    const token = req.cookies?.utoken || req.headers?.utoken;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
      if (decoded.role === "user") {
        req.user = decoded;
        req.userId = decoded.id;
      }
    }
  } catch (error) {
    // Silently ignore errors (optional auth)
  }
  
  next();
};

module.exports = optionalUserAuth;
