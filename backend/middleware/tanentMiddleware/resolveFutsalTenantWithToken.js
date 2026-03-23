const jwt = require("jsonwebtoken");

const resolveFutsalTenant = require("./tanent.middleware");

// Combines:
// - futsal token auth (sets req.futsalCode/req.futsalId)
// - fallback tenant resolving via req.params.futsalId (sets req.tanent.code)
//
// Used for endpoints that should be accessible by both:
// - futsal owners (via token)
// - normal users (via futsalId param)
const resolveFutsalTenantWithToken = async (req, res, next) => {
  // If some earlier middleware already set futsalCode, skip token resolving.
  if (!req.futsalCode) {
    try {
      const token =
        req.cookies?.ftoken || req.headers.authorization?.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FUTSAL);
        if (decoded?.role === "futsal") {
          req.futsal = decoded;
          req.futsalId = decoded.id;
          req.futsalCode = decoded.code;
        }
      }
    } catch (e) {
      // Ignore token errors for normal users; we fallback to resolveFutsalTenant.
    }
  }

  // If futsalCode is set from token, we don't need to resolve tenant from DB.
  if (req.futsalCode) return next();

  return resolveFutsalTenant(req, res, next);
};

module.exports = resolveFutsalTenantWithToken;

