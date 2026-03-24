const express = require('express');
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated');
const { getPayments, createPayment, verifyPayment } = require('../../controllers/footsalControllers/payment.controller');
const router = express.Router()

router.get(
    '/futsal/payment', // #swagger.tags=['Futsal/payment']
    isFutsalAuthenticated,
    getPayments
)

router.post(
    '/futsal/payment-create', //#swagger.tags=['Futsal/payment']
    isFutsalAuthenticated,
    createPayment
)

router.post(
    '/futsal/payment-verify', // #swagger.tags=['Futsal/payment']
    isFutsalAuthenticated,
    verifyPayment
)

module.exports = router