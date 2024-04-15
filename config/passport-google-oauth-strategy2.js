const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");
// Configure the Google OAuth strategy for use by Passport.
passport.use(
  new GoogleStrategy(
    {
      clientID: env.google_clientID,
      clientSecret: env.google_clientSecret,
      callbackURL: env.google_callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user based on their email address.
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If user exists, log them in.
          return done(null, user);
        } else {
          // If user does not exist, create a new user.
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"), // Create a random password.
          });
          return done(null, user);
        }
      } catch (err) {
        console.error("Error processing Google login", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;
