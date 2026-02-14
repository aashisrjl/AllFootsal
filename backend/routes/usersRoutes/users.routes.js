const express = require('express');
const router = express.Router();

// Google callback
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['openid','profile', 'email'],
    session: false}
  )
);
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth',session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.USER_FRONTEND_URL || 'http://localhost:3001'}`);
  }
);

router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'],session: false })
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth',session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.USER_FRONTEND_URL || 'http://localhost:3001'}`);
  }
);


module.exports = router;