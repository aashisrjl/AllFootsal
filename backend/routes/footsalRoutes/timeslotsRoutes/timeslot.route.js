const express = require("express");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenantWithToken = require("../../middleware/tanentMiddleware/resolveFutsalTenantWithToken");

const {
  getTimeslot,
  createTimeslot,
  updateTimeslot,
  deleteTimeslot,
} = require("../../controllers/footsalControllers/timeslotController/timeslot.controller");

const router = express.Router();

// by admin and user (read)
router.get(
  "/futsal/:futsalId/timeslots",
  resolveFutsalTenantWithToken,
  getTimeslot
);

// admin (write)
router.post(
  "/futsal/timeslots/create", 
  isFutsalAuthenticated, 
  createTimeslot
);

router.put(
  "/futsal/timeslots/update/:id",
   isFutsalAuthenticated, 
   updateTimeslot
  );
  
router.delete(
  "/futsal/timeslots/delete/:id",
  isFutsalAuthenticated,
  deleteTimeslot
);

module.exports = router;

