function auth(requiredRole) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
  };
}

module.exports = auth;