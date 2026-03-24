const express = require("express");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const isUserAuthenticated = require("../../middleware/authMiddleware/userAuthenticate");
const resolveFutsalTenant = require("../../middleware/tanentMiddleware/tanent.middleware");

const {
  getRatings,
  getRatingByUser,
  postRating,
  updateRating,
  deleteRating,
  deleteRatingByAdmin,
} = require("../../controllers/footsalControllers/ratingController/rating.controller");

const router = express.Router();

// futsal owner/admin
router.get(
  "/futsal/ratings", 
  isFutsalAuthenticated,
   getRatings
);

router.delete(
  "/futsal/ratings/:ratingId",
  isFutsalAuthenticated,
  deleteRatingByAdmin
);

// user
router.get(
  "/futsal/:futsalId/ratings/me",
  resolveFutsalTenant,
  isUserAuthenticated,
  getRatingByUser
);
router.post(
  "/futsal/:futsalId/ratings/me",
  resolveFutsalTenant,
  isUserAuthenticated,
  postRating
);

router.put(
  "/futsal/:futsalId/ratings/me",
  resolveFutsalTenant,
  isUserAuthenticated,
  updateRating
);

router.delete(
  "/futsal/:futsalId/ratings/me",
  resolveFutsalTenant,
  isUserAuthenticated,
  deleteRating
);

module.exports = router;

