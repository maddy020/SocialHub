const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user || user.password != password) {
          req.flash("error", "Invalid UserName/Password");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        req.flash("error", err);
        return done(err);
      }
    }
  )
);
// serializing user to decide which key is to be set in cookie.

passport.serializeUser(async (user, done) => {
  return done(null, user.id);
});

//deserialzzing the user from cookie.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return done(null, user);
    }
  } catch (err) {
    console.log("error in finding user");
    return done(err);
  }
});
passport.checkAuthentication = async (req, res, next) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/sign-in");
};
passport.setAuthenticatedUser = async (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.user conatins current user from cookie we r sending to view
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
