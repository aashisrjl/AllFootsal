const express = require("express");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const resolveFutsalTenant = require("../../../middleware/tanentMiddleware/tanent.middleware");

const {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
} = require("../../../controllers/footsalControllers/contactController/contact.controller");

const router = express.Router();

// user/public -> send contact message to specific futsal
router.post(
  "/futsal/:futsalId/contact", // #swagger.tags = ['Futsal/Tenant/Contact']
  resolveFutsalTenant,
  createContact
);

// futsal owner/admin -> manage contacts
router.get(
  "/futsal/contact", // #swagger.tags = ['Futsal/Tenant/Contact']
   isFutsalAuthenticated, 
   getContacts
  ); 
router.patch(
  "/futsal/contact/:contactId/read", // #swagger.tags = ['Futsal/Tenant/Contact']
  isFutsalAuthenticated,
  markContactAsRead
); 
router.delete(
  "/futsal/contact/:contactId", // #swagger.tags = ['Futsal/Tenant/Contact']
  isFutsalAuthenticated,
  deleteContact
);

module.exports = router;

