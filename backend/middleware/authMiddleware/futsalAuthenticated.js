const jwt = require("jsonwebtoken");

const isFutsalAuthenticated = (req, res, next) => {
  try {
    let ftoken = req.cookies?.ftoken || req.headers?.ftoken || req.headers.authorization?.split(" ")[1];
    // ✅ handle Authorization header
    if (!ftoken && req.headers.authorization) {
        const authHeader = req.headers.authorization;

        // support both formats
        if (authHeader.startsWith("Bearer ")) {
            ftoken = authHeader.split(" ")[1];
        } else {
            ftoken = authHeader; // raw token (your current case)
        }
    }
    if (!ftoken) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(ftoken, process.env.JWT_SECRET_FUTSAL);
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
