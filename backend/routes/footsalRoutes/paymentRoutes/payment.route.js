const express = require("express");
const {
  createPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  verifyPayment,
} = require("../../controllers/footsalControllers/paymentController/payment.controller");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const isUserAuthenticated = require("../../middleware/authMiddleware/userAuthenticate");
const resolveFutsalTenant = require("../../middleware/tanentMiddleware/tanent.middleware");
const router = express.Router();
const {BASE_URL}  = process.env || "http://localhost:3000/api/v1";

router.post(
    `/payment-create`, // #swagger.tags=["Futsal/Payment"]
    isFutsalAuthenticated,
     createPayment
    );

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
    `/payment-verify`, // #swagger.tags=["Futsal/Payment"]
    isFutsalAuthenticated,
     verifyPayment
    );

module.exports = router;
