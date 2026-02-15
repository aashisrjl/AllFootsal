const express = require("express");
const router = express.Router();
const userRegister = require("./../../controllers/authControllers/userAuthController");
const RegisterFootsal = require("./../../controllers/authControllers/footsalAuthController");
const { VerifyOtp, Login, Logout } = require("../../controllers/authControllers/AllAuthController");
const generateJwt = require("../../utils/jwt/generateJwt");
const passport = require("passport");
const {NODE_ENV} = process.env;

const BASE_URL = "/api/auth";

// User ======================================
router.post(`${BASE_URL}/user/register`, userRegister);
router.post(`${BASE_URL}/user/login`, Login);

// Google User OAuth
router.get(
  `${BASE_URL}/user/google`,
  passport.authenticate("google-user", { scope: ["profile", "email"], session: false })
);

router.get(
  `${BASE_URL}/user/google/callback`,
  passport.authenticate("google-user", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = generateJwt(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET_USER,
      process.env.TOKEN_EXPIRATION_USER
    );
    res.cookie("utoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const redirectUrl = `${process.env.USER_FRONTEND_URL}`;
    res.redirect(redirectUrl);
  }
);

// Facebook User OAuth
router.get(
  `${BASE_URL}/user/facebook`,
  passport.authenticate("facebook-user", { scope: ["email"], session: false })
);

router.get(
  `${BASE_URL}/user/facebook/callback`,
  passport.authenticate("facebook-user", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = generateJwt(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET_USER,
      process.env.TOKEN_EXPIRATION_USER
    );
    res.cookie("utoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const redirectUrl = `${process.env.USER_FRONTEND_URL}`;
    res.redirect(redirectUrl);
  }
);

// Futsal ===================================
router.post(`${BASE_URL}/futsal/register`, RegisterFootsal);
router.post(`${BASE_URL}/futsal/login`, Login);

// Google Futsal OAuth
router.get(
  `${BASE_URL}/futsal/google`,
  passport.authenticate("google-futsal", { scope: ["profile", "email"], session: false })
);

router.get(
  `${BASE_URL}/futsal/google/callback`,
  passport.authenticate("google-futsal", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = generateJwt(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        code: req.user.footsalCode,
      },
      process.env.JWT_SECRET_FUTSAL,
      process.env.TOKEN_EXPIRATION_FUTSAL
    );
    res.cookie("ftoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
      const redirectUrl = `${process.env.FUTSAL_FRONTEND_URL}`;
    // const redirectUrl = `${process.env.FUTSAL_FRONTEND_URL}/auth/success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

// Common
router.post(`${BASE_URL}/verify-otp/`, VerifyOtp);
router.post(`${BASE_URL}/logout`, Logout);

module.exports = router;