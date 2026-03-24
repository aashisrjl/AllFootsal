const express = require("express");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenantWithToken = require("../../middleware/tanentMiddleware/resolveFutsalTenantWithToken");
const { mediaUpload } = require("../../services/multer/mediaMulterConfig");

const {
  uploadMedia,
  getHomeMedia,
  getPitchMedia,
  getPitchMediaById,
  getFacilityMedia,
  getEventMedia,
  getOtherMedia,
  uploadPitchMedia,
  uploadFacilitiesMediaByPitchId,
  deleteMediaByCategory,
  deleteMediaById,
} = require("../../controllers/footsalControllers/mediaController/media.controller");

const router = express.Router();

// read (owner or user) - requires futsalId in URL
router.get(
  "/futsal/:futsalId/media/home",
  resolveFutsalTenantWithToken,
  getHomeMedia
);
router.get(
  "/futsal/:futsalId/media/pitch",
  resolveFutsalTenantWithToken,
  getPitchMedia
);
router.get(
  "/futsal/:futsalId/media/pitch/:pitchId",
  resolveFutsalTenantWithToken,
  getPitchMediaById
);
router.get(
  "/futsal/:futsalId/media/facility",
  resolveFutsalTenantWithToken,
  getFacilityMedia
);
router.get(
  "/futsal/:futsalId/media/event",
  resolveFutsalTenantWithToken,
  getEventMedia
);
router.get(
  "/futsal/:futsalId/media/other",
  resolveFutsalTenantWithToken,
  getOtherMedia
);

// owner uploads (use isFutsalAuthenticated => req.futsalCode)
router.post(
  "/futsal/media/upload",
  isFutsalAuthenticated,
  mediaUpload.single("media"),
  uploadMedia
);
router.post(
  "/futsal/media/pitch/:pitchId/upload",
  isFutsalAuthenticated,
  mediaUpload.single("media"),
  uploadPitchMedia
);
router.post(
  "/futsal/media/pitch/:pitchId/facility-upload",
  isFutsalAuthenticated,
  mediaUpload.single("media"),
  uploadFacilitiesMediaByPitchId
);

// owner deletes
router.delete(
  "/futsal/media/category/:category",
  isFutsalAuthenticated,
  deleteMediaByCategory
);
router.delete(
  "/futsal/media/category/:category/pitch/:pitchId",
  isFutsalAuthenticated,
  deleteMediaByCategory
);
router.delete(
  "/futsal/media/:id",
  isFutsalAuthenticated,
  deleteMediaById
);

module.exports = router;

