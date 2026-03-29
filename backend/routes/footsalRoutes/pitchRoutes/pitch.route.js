const express = require("express");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenantWithToken = require("../../../middleware/tanentMiddleware/resolveFutsalTenantWithToken");

const {
  getPitches,
  getPitchById,
  createPitch,
  editPitch,
} = require("../../../controllers/footsalControllers/pitchController/pitch.controller");

const router = express.Router();

// by admin and user (read)
router.get(
  "/futsal/:futsalId/pitches", // #swagger.tags = ['Futsal/Tenant/Pitch']
  resolveFutsalTenantWithToken,
  getPitches
);

router.get(
  "/futsal/:futsalId/pitches/:id", // #swagger.tags = ['Futsal/Tenant/Pitch']
  resolveFutsalTenantWithToken,
  getPitchById
);

// admin (write)
router.post(
  "/futsal/pitches/create", // #swagger.tags = ['Futsal/Tenant/Pitch']
  isFutsalAuthenticated,
  createPitch
);

router.put(
  "/futsal/pitches/edit/:id", // #swagger.tags = ['Futsal/Tenant/Pitch']
  isFutsalAuthenticated,
  editPitch
);

module.exports = router;

