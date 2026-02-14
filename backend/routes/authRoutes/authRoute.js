const express = require('express');
const router = express.Router();
const userRegister = require("./../../controllers/authControllers/userAuthController")
const RegisterFootsal = require("./../../controllers/authControllers/footsalAuthController");
const { VerifyOtp, Login } = require('../../controllers/authControllers/AllAuthController');

const BASE_URL = '/api/auth';
// User ======================================
router.post(`${BASE_URL}/user/register`, userRegister);
router.post(`${BASE_URL}/user/login`, Login);

// Footsal ===================================
router.post(`${BASE_URL}/futsal/register`, RegisterFootsal);
router.post(`${BASE_URL}/footsal/login`, Login);

router.post(`${BASE_URL}/verify-otp/`, VerifyOtp);
module.exports = router;

