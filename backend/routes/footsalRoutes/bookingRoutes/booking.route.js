const express = require("express");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const isUserAuthenticated = require("../../middleware/authMiddleware/userAuthenticate");
const resolveFutsalTenant = require("../../middleware/tanentMiddleware/tanent.middleware");

const {
  getBookingsByAdmin,
  getBookingsByUser,
  cancelBooking,
  cancelBookingByAdmin,
  deleteBookingByUser,
  deleteBookingByAdmin,
  getBookingStats,
  createBooking,
} = require("../../controllers/footsalControllers/bookingController/booking.controller");

const router = express.Router();

// admin (owner)
router.get(
  "/futsal/bookings",
   isFutsalAuthenticated,
    getBookingsByAdmin
  );

router.get(
  "/futsal/bookings/stats",
  isFutsalAuthenticated,
  getBookingStats
);

router.patch(
  "/futsal/bookings/:bookingId/cancel",
  isFutsalAuthenticated,
  cancelBookingByAdmin
);

router.delete(
  "/futsal/bookings/:bookingId",
  isFutsalAuthenticated,
  deleteBookingByAdmin
);

// user
router.get(
  "/futsal/:futsalId/bookings",
  resolveFutsalTenant,
  isUserAuthenticated,
  getBookingsByUser
);

router.post(
  "/futsal/:futsalId/bookings",
  resolveFutsalTenant,
  isUserAuthenticated,
  createBooking
);

router.patch(
  "/futsal/:futsalId/bookings/:bookingId/cancel",
  resolveFutsalTenant,
  isUserAuthenticated,
  cancelBooking
);

router.delete(
  "/futsal/:futsalId/bookings/:bookingId",
  resolveFutsalTenant,
  isUserAuthenticated,
  deleteBookingByUser
);

module.exports = router;

