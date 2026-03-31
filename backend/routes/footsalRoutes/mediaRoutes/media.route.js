const express = require("express");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenantWithToken = require("../../../middleware/tanentMiddleware/resolveFutsalTenantWithToken");
const { mediaUpload } = require("../../../services/multer/mediaMulterConfig");

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
  getMediaBycategory,
} = require("../../../controllers/footsalControllers/mediaController/media.controller");
const resolveFutsalTenant = require("../../../middleware/tanentMiddleware/tanent.middleware");

const router = express.Router();

// read (owner or user) - requires futsalId in URL
router.get(
  "/futsal/:futsalId/media/home", // #swagger.tags = ['Futsal/Tenant/Media']
  resolveFutsalTenantWithToken,
  getHomeMedia
);

// get media by category
router.get(
  "/futsal/:futsalId/media/", // #swagger.tags = ['Futsal/Tenant/Media']
  getMediaBycategory
);
router.get(
  "/futsal/:futsalId/media/pitch",
  resolveFutsalTenantWithToken,
  getPitchMedia
);
router.get(
  "/futsal/:futsalId/media/pitch/:pitchId", // #swagger.tags = ['Futsal/Tenant/Media']
  resolveFutsalTenantWithToken,
  getPitchMediaById
);
router.get(
  "/futsal/:futsalId/media/facility", // #swagger.tags = ['Futsal/Tenant/Media']
  resolveFutsalTenantWithToken,
  getFacilityMedia
);
router.get(
  "/futsal/:futsalId/media/event", // #swagger.tags = ['Futsal/Tenant/Media']
  resolveFutsalTenantWithToken,
  getEventMedia
);
router.get(
  "/futsal/:futsalId/media/other", // #swagger.tags = ['Futsal/Tenant/Media']
  resolveFutsalTenantWithToken,
  getOtherMedia
);

// owner uploads (use isFutsalAuthenticated => req.futsalCode)
router.post(
  "/futsal/media/upload", // #swagger.tags = ['Futsal/Tenant/Media']
  isFutsalAuthenticated,
  mediaUpload.array("media"),
  uploadMedia
);
router.post(
  "/futsal/media/pitch/:pitchId/upload", // #swagger.tags = ['Futsal/Tenant/Media']
  isFutsalAuthenticated,
  mediaUpload.array("media"),
  uploadPitchMedia
);
router.post(
  "/futsal/media/pitch/:pitchId/facility-upload", // #swagger.tags=['Futsal/Tenant/Media']
  isFutsalAuthenticated,
  mediaUpload.array("media"),
  uploadFacilitiesMediaByPitchId
);

// owner deletes
router.delete(
  "/futsal/media/category/:category", // #swagger.tags = ['Futsal/Tenant/Media']
  isFutsalAuthenticated,
  deleteMediaByCategory
);
router.delete(
  "/futsal/media/category/:category/pitch/:pitchId", // #swagger.tags = ['Futsal/Tenant/Media']
  isFutsalAuthenticated,
  deleteMediaByCategory
);
router.delete(
  "/futsal/media/:id", // #swagger.tags = ['Futsal/Tenant/Media']
  isFutsalAuthenticated,
  deleteMediaById
);

module.exports = router;

