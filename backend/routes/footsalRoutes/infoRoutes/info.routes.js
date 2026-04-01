const express = require('express');
const isFutsalAuthenticated = require('../../../middleware/authMiddleware/futsalAuthenticated');
const { createInfo, getInfo, updateInfo } = require('../../../controllers/footsalControllers/infoController/info.controller');
const resolveFutsalTenantWithToken = require('../../../middleware/tanentMiddleware/resolveFutsalTenantWithToken');
const router = express.Router()

router.post(
    '/futsal/info/create', // #swagger.tags=["Futsal/Tenant/info"]
    isFutsalAuthenticated,
    createInfo
)

router.get(
    '/futsal/:futsalId/info/', // #swagger.tags=["Futsal/Tenant/info"]
    getInfo
)

router.put(
    '/futsal/info/:infoId', // #swagger.tags = ['Futsal/Tenant/info']
    isFutsalAuthenticated,
    updateInfo
)

module.exports = router