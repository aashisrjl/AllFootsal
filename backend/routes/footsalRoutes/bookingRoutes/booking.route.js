const express = require("express");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const { getBookingStats, cancelBookingByAdmin, confirmBookingByAdmin, deleteBookingByAdmin, getBookingsByUser, createBooking, cancelBooking, deleteBookingByUser, getBookingsByAdmin } = require("../../../controllers/footsalControllers/bookingController/booking.controller");
const resolveFutsalTenant = require("../../../middleware/tanentMiddleware/tanent.middleware");
const isUserAuthenticated = require("../../../middleware/authMiddleware/userAuthenticate");

const router = express.Router();

// admin (owner)
router.get(
  "/futsal-bookings", // #swagger.tags = ['Futsal/Tenant/Bookings']
   isFutsalAuthenticated,
    getBookingsByAdmin
  );

router.get(
  "/futsal/bookings/stats", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isFutsalAuthenticated,
  getBookingStats
);

router.patch(
  "/futsal/bookings/:bookingId/cancel", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isFutsalAuthenticated,
  cancelBookingByAdmin
);

router.patch(
  "/futsal/bookings/:bookingId/confirm", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isFutsalAuthenticated,
  confirmBookingByAdmin
);

router.delete(
  "/futsal/bookings/:bookingId", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isFutsalAuthenticated,
  deleteBookingByAdmin
);

// user
router.get(
  "/futsal/:futsalId/bookings", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isUserAuthenticated,
  getBookingsByUser
);

router.post(
  "/futsal/:futsalId/bookings", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isUserAuthenticated,
  createBooking
);

router.patch(
  "/futsal/:futsalId/bookings/:bookingId/cancel", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isUserAuthenticated,
  cancelBooking
);

router.delete(
  "/futsal/:futsalId/bookings/:bookingId", // #swagger.tags = ['Futsal/Tenant/Bookings']
  isUserAuthenticated,
  deleteBookingByUser
);

module.exports = router;

