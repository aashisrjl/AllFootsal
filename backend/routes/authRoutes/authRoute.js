const express = require('express');
const router = express.Router();
const userRegister = require("./../../controllers/authControllers/userAuthController")
const Login = require("./../../controllers/authControllers/userAuthController")
const RegisterFootsal = require("./../../controllers/authControllers/footsalAuthController")


// User ======================================
router.post('/user/register', userRegister);
router.post('/user/login', Login);


// Footsal ===================================
router.post('/footsal/register', RegisterFootsal);
router.post('/footsal/login', Login);


module.exports = router;

