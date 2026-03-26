const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getProfile, updateProfile, updateProfileImage, deleteProfileImage } = require('../../controllers/usersControllers/userController');
const isBothAuthenticated = require('../../middleware/authMiddleware/bothAuthenticated');
const isUserAuthenticated = require('../../middleware/authMiddleware/userAuthenticate');
const { upload } = require('../../services/multer/multerConfig');


router.get(
    '/users', // #swagger.tags=['Users']
    getAllUsers
);

router.get(
    '/users/:id', // #swagger.tags=['Users']
    isBothAuthenticated,
     getUserById
    );

router.get(
    '/user/profile/', // #swagger.tags=['Users']
    isUserAuthenticated, 
    getProfile
);

router.put(
    '/user/profile/',  // #swagger.tags=['Users']
    isUserAuthenticated, 
    updateProfile
);

router.put(
    '/users/profile/image', // #swagger.tags=['Users']
    isUserAuthenticated, 
    upload.single('image'),
    updateProfileImage
);

router.delete(
    '/users/profile/image', // #swagger.tags=['Users']
    isUserAuthenticated, 
    deleteProfileImage
);

module.exports = router;