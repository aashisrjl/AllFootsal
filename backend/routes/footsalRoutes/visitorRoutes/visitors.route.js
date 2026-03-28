const express = require("express");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const optionalUserAuth = require("../../../middleware/authMiddleware/optionalUserAuth");

const {
  getVisitorsDetails,
  trackVisitor,
} = require("../../../controllers/footsalControllers/visitorsController/visitors.controller");

const router = express.Router();

// owner/admin
router.get(
  "/futsal-visitors", // #swagger.tags=['Futsal/tenant/visitor']
   isFutsalAuthenticated,
    getVisitorsDetails
  );

// track a visitor (user auth optional)
router.post(
  "/futsal/:futsalId/visitors/track",  // #swagger.tags=['Futsal/tenant/visitor']
  optionalUserAuth,
  trackVisitor
);

module.exports = router;

