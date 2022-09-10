const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PASSPORT_GOOGLE_CLIEN_ID,
      clientSecret: process.env.PASSPORT_GOOGLE_CLIENTSECRET,
      callbackURL: process.env.PASSPORT_GOOGLE_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => cb(null, profile)
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.PASSPORT_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.PASSPORT_FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.PASSPORT_FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, cb) => cb(null, profile)
  )
);
