const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// Configure the Google OAuth strategy for use by Passport.
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "2727485938-ocq90ndbs7sc8mbfhdnqvr6eqtvrkfgl.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
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
