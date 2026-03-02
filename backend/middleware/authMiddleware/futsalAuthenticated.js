const jwt = require("jsonwebtoken");

const isFutsalAuthenticated = (req, res, next) => {
  try {
    let token = req.cookies.ftoken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_FUTSAL);
    if (decoded.role !== "futsal") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.futsal = decoded;
    req.futsalId = decoded.id;
    req.futsalCode = decoded.code;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = isFutsalAuthenticated;
