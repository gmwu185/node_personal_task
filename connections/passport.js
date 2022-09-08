const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../model/users');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PASSPORT_GOOGLE_CLIEN_ID,
      clientSecret: process.env.PASSPORT_GOOGLE_CLIENTSECRET,
      callbackURL: process.env.PASSPORT_GOOGLE_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log('profile._json', profile._json);
      const { name, email, sub } = profile._json;
      const googleUser = await User.findOne({
        googleId: sub,
      });
      console.log('googleUser', googleUser);
      if (googleUser) {
        console.log('使用者已存在');
        return cb(null, googleUser);
      } else {
        console.log('使用者不存在');
        const password = await bcrypt.hash(
          process.env.THIRD_DEFAULT_PASSWORD,
          12
        );
        const newUser = await User.create({
          userName: name,
          email: email,
          password,
          googleId: sub,
        });
        return cb(null, newUser);
      }
    }
  )
);
