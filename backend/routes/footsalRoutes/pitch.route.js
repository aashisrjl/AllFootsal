const express = require("express");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenantWithToken = require("../../middleware/tanentMiddleware/resolveFutsalTenantWithToken");

const {
  getPitches,
  getPitchById,
  createPitch,
  editPitch,
} = require("../../controllers/footsalControllers/pitchController/pitch.controller");

const router = express.Router();

// by admin and user (read)
router.get(
  "/futsal/:futsalId/pitches",
  resolveFutsalTenantWithToken,
  getPitches
);

router.get(
  "/futsal/:futsalId/pitches/:id",
  resolveFutsalTenantWithToken,
  getPitchById
);

// admin (write)
router.post(
  "/futsal/pitches/create",
  isFutsalAuthenticated,
  createPitch
);

router.put(
  "/futsal/pitches/edit/:id",
  isFutsalAuthenticated,
  editPitch
);

module.exports = router;

