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
  /** #swagger.summary = 'google登入',
   * #swagger.description = 'google登入，前端頁面需有一頁接回傳的token',
   * #swagger.tags = ['tp-auth (第三方登入)'],
   */
);
router.get(
  '/user/google/callback',
  passport.authenticate('google', { session: false }),
  thridOauthControllers.googleCallback
  /** #swagger.summary = 'google登入後callback url',
   * #swagger.description = 'google callback後會將資料寫進user表',
   * #swagger.tags = ['tp-auth (第三方登入)'],
   * #swagger.ignore = true
   */
);

// Facebook OAuth
router.get(
  '/user/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);
router.get(
  '/user/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/index.html',
  }),
  thridOauthControllers.facebookCallback
);

module.exports = router;
