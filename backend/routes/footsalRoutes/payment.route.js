const express = require("express");
const {
  createPayment,
  getPayments,
  verifyPayment,
} = require("../../controllers/footsalControllers/paymentController/payment.controller");
const isFutsalAuthenticated = require("../../middleware/authMiddleware/futsalAuthenticated");
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

router.post(
    `/payment-verify`, // #swagger.tags=["Futsal/Payment"]
    isFutsalAuthenticated,
     verifyPayment
    );

module.exports = router;
