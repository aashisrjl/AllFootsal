const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    let token =
      req.cookies.utoken ||
      req.cookies.ftoken ||
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // First try verifying as USER
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET_USER);

      if (decodedUser.role === "user") {
        req.user = decodedUser;
        req.userId = decodedUser.id;
        return next();
      }
    } catch (err) {
      // ignore and try futsal
    }

    // Then try verifying as FUTSAL
    try {
      const decodedFutsal = jwt.verify(token, process.env.JWT_SECRET_FUTSAL);

      if (decodedFutsal.role === "futsal") {
        req.futsal = decodedFutsal;
        req.futsalId = decodedFutsal.id;
        req.futsalCode = decodedFutsal.code;
        return next();
      }
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(401).json({ error: "Unauthorized role" });

  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = isAuthenticated;
