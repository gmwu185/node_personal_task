const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PASSPORT_GOOGLE_CLIEN_ID,
      clientSecret: process.env.PASSPORT_GOOGLE_CLIENTSECRET,
      callbackURL: process.env.PASSPORT_GOOGLE_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      return cb(null, 'user');
    }
  )
);
