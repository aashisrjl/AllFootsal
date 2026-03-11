const express = require('express');
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated');
const { addFutsalSubscription, getFutsalSubscription, addTrialSubscription, editFutsalSubscription, cancelFutsalSubscription } = require('../../controllers/footsalControllers/subscriptionController/subscription.controller');
const router = express.Router()
const {BASE_URL} = process.env

router.get(BASE_URL + "/subscription", // #swagger.tags=["Futsal/Subscription"]
    isFutsalAuthenticated,
    getFutsalSubscription
        );

    router.post(
        BASE_URL+"/create-subscription", // #swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        addFutsalSubscription
    );

    router.patch(
        BASE_URL+"/update-subscription", // #swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        editFutsalSubscription
    );

    router.delete(BASE_URL+"/cancel-subscription", // #swagger.tags=["Futsal/Subscription"]
        isFutsalAuthenticated,
        cancelFutsalSubscription 
    );


router.post(
    BASE_URL + "/subscription-trial", //#swagger.tags=['Futsal/Subscription]
    isFutsalAuthenticated,
    addTrialSubscription
)

module.exports = router