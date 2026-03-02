const express = require('express');
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated');
const router = express.Router()
const {BASE_URL} = process.env

router.route(BASE_URL + "/subscription")
    .get(
    isFutsalAuthenticated,
    getFutsalSubscription
        )
    .post(isFutsalAuthenticated,postFutsalSubscription)
    .patch(isFutsalAuthenticated,editFutsalSubscription)
    .post(isFutsalAuthenticated, cancelFutsalSubscription)


router.route(BASE_URL + "/subscription-trial").post(
    isFutsalAuthenticated,
    AddTrialSubscription
)



module.exports = router