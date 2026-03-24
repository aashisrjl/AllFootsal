const express = require("express");
const {
  createPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  verifyPayment,
} = require("../../../controllers/footsalControllers/paymentController/payment.controller");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const isUserAuthenticated = require("../../../middleware/authMiddleware/userAuthenticate");
const resolveFutsalTenant = require("../../../middleware/tanentMiddleware/tanent.middleware");
const router = express.Router();

router.get(
    `/payment`,  // #swagger.tags=["Futsal/Payment"]
    isFutsalAuthenticated, 
    getPayments
);

router.get(
    `/payment/:paymentId`, // #swagger.tags=["Futsal/Payment"]
    isFutsalAuthenticated,
    getPaymentById
);

// user side
router.get(
    `/futsal/:futsalId/payments/me`,
    resolveFutsalTenant,
    isUserAuthenticated,
    getUserPayments
);

router.post(
    `/futsal/:futsalId/payments/create`, // #swagger.tags=["Futsal/Payment"]
    resolveFutsalTenant,
    isUserAuthenticated,
    createPayment
);

router.post(
    `/futsal/:futsalId/payments/:paymentId/verify`, // #swagger.tags=["Futsal/Payment"]
    resolveFutsalTenant,
    isUserAuthenticated,
    verifyPayment
);

module.exports = router;
