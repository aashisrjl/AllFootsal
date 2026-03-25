const express = require("express");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenantWithToken = require("../../../middleware/tanentMiddleware/resolveFutsalTenantWithToken");

const {
  getTimeslot,
  createTimeslot,
  updateTimeslot,
  deleteTimeslot,
} = require("../../../controllers/footsalControllers/timeslotController/timeslot.controller");

const router = express.Router();

// by admin and user (read)
router.get(
  "/futsal/:futsalId/timeslots", // #swagger.tags = ['Futsal/Tenant/Timeslots']
  resolveFutsalTenantWithToken,
  getTimeslot
);

// admin (write)
router.post(
  "/futsal/timeslots/create", // #swagger.tags = ['Futsal/Tenant/Timeslots']
  isFutsalAuthenticated, 
  createTimeslot
);

router.put(
  "/futsal/timeslots/update/:id", // #swagger.tags = ['Futsal/Tenant/Timeslots']
   isFutsalAuthenticated, 
   updateTimeslot
  );
  
router.delete(
  "/futsal/timeslots/delete/:id", // #swagger.tags = ['Futsal/Tenant/Timeslots']
  isFutsalAuthenticated,
  deleteTimeslot
);

module.exports = router;

