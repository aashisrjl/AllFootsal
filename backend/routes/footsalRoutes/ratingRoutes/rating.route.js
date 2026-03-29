const express = require("express");
const { getRatings, deleteRatingByAdmin, getRatingByUser, postRating, updateRating, deleteRating } = require("../../../controllers/footsalControllers/ratingController/rating.controller");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const isUserAuthenticated = require("../../../middleware/authMiddleware/userAuthenticate");


const router = express.Router();

// futsal owner/admin
router.get(
  "/futsal-ratings", // #swagger.tags = ['Futsal/Tenant/Ratings']
  isFutsalAuthenticated,
   getRatings
);

router.delete(
  "/futsal/ratings/:ratingId", // #swagger.tags = ['Futsal/Tenant/Ratings']
  isFutsalAuthenticated,
  deleteRatingByAdmin
);

// user
router.get(
  "/futsal/:futsalId/ratings/me", // #swagger.tags = ['Futsal/Tenant/Ratings']
  isUserAuthenticated,
  getRatingByUser
);
router.post(
  "/futsal/:futsalId/ratings/me", // #swagger.tags = ['Futsal/Tenant/Ratings']
  isUserAuthenticated,
  postRating
);

router.put(
  "/futsal/:futsalId/ratings/me", // #swagger.tags = ['Futsal/Tenant/Ratings']
  isUserAuthenticated,
  updateRating
);

router.delete(
  "/futsal/:futsalId/ratings/me", // #swagger.tags = ['Futsal/Tenant/Ratings']
  isUserAuthenticated,
  deleteRating
);

module.exports = router;

