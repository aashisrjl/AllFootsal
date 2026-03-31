const express = require("express");
const router = express.Router();
const userRegister = require("./../../controllers/authControllers/userAuthController");
const RegisterFootsal = require("./../../controllers/authControllers/footsalAuthController");
const { VerifyOtp, Login, Logout, forgotPassword, changeForgotPassword, ChangePassword } = require("../../controllers/authControllers/AllAuthController");
const generateJwt = require("../../utils/jwt/generateJwt");
const passport = require("passport");
const isUserAuthenticated = require("../../middleware/authMiddleware/userAuthenticate");
const {NODE_ENV,BASE_URL} = process.env;




// User ======================================
router.post(
  `/auth/user/register`, // #swagger.tags = ['Auth/User']
   userRegister); 

// user login
router.patch(
  '/auth/change-password', // #swagger.tags = ['Auth/User']
  isUserAuthenticated,
  ChangePassword
);

router.post(
  `/auth/user/login`  // #swagger.tags = ['Auth/User']
  , Login);

router.post(
  `/auth/forgot-password`,// #swagger.tags = ['Auth']
   forgotPassword); 


router.post(
  `/auth/change-forgot-password`, // #swagger.tags = ['Auth']
   changeForgotPassword);



router.get(
  `/auth/user/google`, // #swagger.tags = ['Auth/User']
  passport.authenticate("google-user", { scope: ["profile", "email"], session: false })
);

router.get(
  `/auth/user/google/callback`,
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


router.get(
  `/auth/user/facebook`, // #swagger.tags = ['Auth/User']
  passport.authenticate("facebook-user", { scope: ["email"], session: false })
);

router.get(
  `/auth/user/facebook/callback`,
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


router.post(
  `/auth/futsal/register`, // #swagger.tags = ['Auth/Footsal']
  RegisterFootsal); 


router.post(
  `/auth/futsal/login`,// #swagger.tags = ['Auth/Footsal']
   Login); 


router.get(
  `/auth/futsal/google`, // #swagger.tags = ['Auth/Footsal']
  passport.authenticate("google-futsal", { scope: ["profile", "email"], session: false })
);

router.get(
  `/auth/futsal/google/callback`,
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


router.post(
  `/auth/verify-otp/`,// #swagger.tags = ['Auth']
  VerifyOtp);


router.post(
  `/auth/logout`, // #swagger.tags = ['Auth']
  Logout); 

module.exports = router;