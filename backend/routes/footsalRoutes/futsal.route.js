const express = require('express');
const { getAllFutsal, getFutsalById, getFutsalbySubsciption_true } = require('../../controllers/footsalControllers/futsal.controller');
const router = express.Router();
// #swagger.tags = ['Futsal']
router.get(
    '/admin/futsals/', // #swagger.tags = ['Futsal']
    getAllFutsal
)

router.get(
    '/futsals/:id', // #swagger.tags = ['Futsal']
    getFutsalById
)

router.get(
    '/futsals', // #swagger.tags = ['Futsal']
    getFutsalbySubsciption_true
)


module.exports = router;