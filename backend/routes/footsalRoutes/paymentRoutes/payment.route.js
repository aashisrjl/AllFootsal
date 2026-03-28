const express = require("express");
const {
  createPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  verifyPayment,
    getPaymentConfigs,
    upsertPaymentConfig,
    disablePaymentConfig,
} = require("../../../controllers/footsalControllers/paymentController/payment.controller");
const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const isUserAuthenticated = require("../../../middleware/authMiddleware/userAuthenticate");
const router = express.Router();

router.get(
    `/payment`,  // #swagger.tags=["Futsal/User/Tenant/Payment"]
    isFutsalAuthenticated, 
    getPayments
);

router.get(
    `/payment/:paymentId`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isFutsalAuthenticated,
    getPaymentById
);

// futsal payment configuration
router.get(
    `/futsal/payment-config`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isFutsalAuthenticated,
    getPaymentConfigs
);

router.get(
    `/futsal/payment-config/:gateway`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isFutsalAuthenticated,
    getPaymentConfigs
);

router.post(
    `/futsal/payment-config`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isFutsalAuthenticated,
    upsertPaymentConfig
);

router.delete(
    `/futsal/payment-config/:gateway`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isFutsalAuthenticated,
    disablePaymentConfig
);

// user side
router.get(
    `/futsal/:futsalId/payments/me`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isUserAuthenticated,
    getUserPayments
);

router.post(
    `/futsal/:futsalId/payments/create`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isUserAuthenticated,
    createPayment
);

router.post(
    `/futsal/:futsalId/payments/:paymentId/verify`, // #swagger.tags=["Futsal/Tenant/User/Payment"]
    isUserAuthenticated,
    verifyPayment
);

module.exports = router;
