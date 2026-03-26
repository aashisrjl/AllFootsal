const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getProfile, updateProfile, updateProfileImage, deleteProfileImage } = require('../../controllers/usersControllers/userController');
const isBothAuthenticated = require('../../middleware/authMiddleware/bothAuthenticated');
const isUserAuthenticated = require('../../middleware/authMiddleware/userAuthenticated');
const { upload } = require('../../services/multer/multerConfig');

router.get(
    '/users', 
    getAllUsers
);
router.get(
    '/users/:id', 
    isBothAuthenticated,
     getUserById
    );

router.get(
    '/users/profile', 
    isUserAuthenticated, 
    getProfile
);

router.put(
    '/users/profile', 
    isUserAuthenticated, 
    updateProfile
);

router.put(
    '/users/profile/image', 
    isUserAuthenticated, 
    upload.single('profileImage'), 
    updateProfileImage
);

router.delete(
    '/users/profile/image', 
    isUserAuthenticated, 
    deleteProfileImage
);

module.exports = router;