const express = require("express");

const isFutsalAuthenticated = require("../../../middleware/authMiddleware/futsalAuthenticated");
const { getAnalytics } = require("../../../controllers/footsalControllers/analyticsController/analytics.controller");

const router = express.Router();

router.get(
    "/futsal/analytics/fetch", // #swagger.tags = ['Futsal/Tenant/Analytics']
    isFutsalAuthenticated,
     getAnalytics
    );

module.exports = router;

