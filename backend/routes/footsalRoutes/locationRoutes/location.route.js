const express = require("express");

const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenant = require("../../../middleware/tanentMiddleware/tanent.middleware");
const { getFutsalLocation, postFutsalLocation, editFutsalLocation, getFutsalLocationByUser } = require("../../../controllers/footsalControllers/locationController/location.controller");

const router = express.Router();

// by futsal (owner)
router.get(
  "/futsal/location", // #swagger.tags = ['Futsal/Tenant/Location']
   isFutsalAuthenticated, 
   getFutsalLocation
  );

router.post(
  "/futsal/location/create", // #swagger.tags = ['Futsal/Tenant/Location']
  isFutsalAuthenticated,
  postFutsalLocation
);

router.put(
  "/futsal/location/edit/:locationId", // #swagger.tags = ['Futsal/Tenant/Location']
  isFutsalAuthenticated,
  editFutsalLocation
);

// by user
router.get(
  "/futsal/:futsalId/location/", // #swagger.tags = ['Futsal/Tenant/Location']
  resolveFutsalTenant,
  getFutsalLocationByUser
);

module.exports = router;

