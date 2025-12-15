const express = require('express');
const router = express.Router();
const userRegister = require("./../../controllers/authControllers/userAuthController")
const userLogin = require("./../../controllers/authControllers/userAuthController")


// User ======================================
router.post('/user/register', userRegister);
router.post('/user/login', userLogin);


// Footsal ===================================
// router.post('/footsal/register', footsalRegister);
// router.post('/footsal/login',footsalRegister)


// Admin ======================================
// router.post('/admin/register', AdminRegister);
// router.post('/admin/login', AdminLogin);

module.exports = router;

