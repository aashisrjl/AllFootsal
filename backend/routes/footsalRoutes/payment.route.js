const express = require("express");
const {
  createPayment,
  getPayments,
  verifyPayment,
} = require("../../controllers/footsalControllers/paymentController/payment.controller");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
const router = express.Router();
const { BASE_URL } = process.env;

router.post(
    BASE_URL + "payment-create", // #swagger.tags=['Futsal/Payment']
    isFutsalAuthenticated,
     createPayment
    );

router.get(
    BASE_URL + "payment",  // #swagger,tags=['Futsal/Payment']
    isFutsalAuthenticated, 
    getPayments
);

router.post(
    BASE_URL + "payment-verify", // #swagger.tags=['Futsal/Payment']
    isFutsalAuthenticated,
     verifyPayment
    );

module.exports = router;
