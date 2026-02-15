const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  try {
    let token = req.cookies.utoken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    if (decoded.role !== "user") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = isUserAuthenticated;