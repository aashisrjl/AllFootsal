const express = require('express');
const { getAllFutsal, getFutsalById, getFutsalbySubsciption_true, getFutsalProfile } = require('../../controllers/footsalControllers/futsal.controller');
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated');
const router = express.Router();
// #swagger.tags = ['Futsal']
router.get(
    '/admin/futsals/', // #swagger.tags = ['Futsal']
    getAllFutsal
)

router.get(
    '/futsal/:id', // #swagger.tags = ['Futsal']
    getFutsalById
)

router.get(
    '/futsals/subscription', // #swagger.tags = ['Futsal']
    getFutsalbySubsciption_true
)

router.get(
    '/futsals-profile', // #swagger.tags = ['Futsal']
    isFutsalAuthenticated,
    getFutsalProfile
)

module.exports = router;