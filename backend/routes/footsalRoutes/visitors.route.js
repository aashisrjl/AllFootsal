const express = require("express");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenant = require("../../middleware/tanentMiddleware/tanent.middleware");

const {
  getVisitorsDetails,
  trackVisitor,
} = require("../../controllers/footsalControllers/visitorsController/visitors.controller");

const router = express.Router();

// owner/admin
router.get(
  "/futsal/visitors",
   isFutsalAuthenticated,
    getVisitorsDetails
  );

// track a visitor (user auth optional)
router.post(
  "/futsal/:futsalId/visitors/track",
  resolveFutsalTenant,
  trackVisitor
);

module.exports = router;

