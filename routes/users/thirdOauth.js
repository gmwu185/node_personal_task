const express = require('express');
const router = express.Router();
const passport = require('passport');
const thridOauthControllers = require('../../controllers/users/thirdOauth');

// Google OAuth
router.get(
  '/user/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);
router.get(
  '/user/google/callback',
  passport.authenticate('google', { session: false }),
  thridOauthControllers.googleCallback
);

module.exports = router;
