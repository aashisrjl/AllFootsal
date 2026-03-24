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
  "/futsal/:futsalId/contact",
  resolveFutsalTenant,
  createContact
);

// futsal owner/admin -> manage contacts
router.get("/futsal/contact", isFutsalAuthenticated, getContacts);
router.patch(
  "/futsal/contact/:contactId/read",
  isFutsalAuthenticated,
  markContactAsRead
);
router.delete(
  "/futsal/contact/:contactId",
  isFutsalAuthenticated,
  deleteContact
);

module.exports = router;

