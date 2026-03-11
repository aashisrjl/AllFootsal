const express = require('express');
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated');
const { addFutsalSubscription, getFutsalSubscription, addTrialSubscription, editFutsalSubscription, cancelFutsalSubscription, renewFutsalSubscription } = require('../../controllers/footsalControllers/subscriptionController/subscription.controller');
const router = express.Router()
const { BASE_URL } = process.env

router.get(
    `/subscription`, // #swagger.tags=["Futsal/Subscription"]
    isFutsalAuthenticated,
    getFutsalSubscription
        );

    router.post(
        `/subscription/create`, // #swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        addFutsalSubscription
    );

    router.put(
        `/subscription/update`, // #swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        editFutsalSubscription
    );

    router.post(
        `/subscription/trial`, //#swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        addTrialSubscription
    );

    router.patch(
        `/subscription/cancel`, // #swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        cancelFutsalSubscription 
    );

    router.post(
         "/subscription/renew", // #swagger.tags=["Futsal/Subscription"]
         isFutsalAuthenticated,
         renewFutsalSubscription
    );



module.exports = router