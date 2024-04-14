const User = require("../models/user");
const accessToken = require("../models/accessToken");
const crypto = require("crypto");
const changePasswordMailer = require("../mailers/changePassword_worker_mailer");

module.exports.open = function (req, res) {
  return res.render("verify_email", {
    title: "SocialHub || Verify Email",
  });
};
module.exports.find = async function (req, res) {
  //req.flash("success","manika");
  //1 create a acess token.
  //send a email.
  let user = await User.findOne({ email: req.body.email });
  //console.log(user);
  if (user) {
    let Token = await crypto.randomBytes(20).toString("hex");
    let AccessToken = await accessToken.create({
      user: user,
      token: Token,
      isValid: true,
    });
    changePasswordMailer.changePassword(AccessToken);
    return res.render("account_verified", {
      title: "Codeial || Verified",
    });
  } else {
    req.flash("error", "No user with this email id exists try again!");
    return res.redirect("back");
  }
};
module.exports.newPassword = async function (req, res) {
  let AccessToken = await accessToken.findOne({ token: req.query.accessToken });
  if (AccessToken && AccessToken.isValid) {
    return res.render("resetPassword", {
      title: "codeial || resetPassword",
      accessToken: AccessToken.token,
    });
  } else {
    req.flash("error", "Token is Expired ! Pls regenerate it.");
    return res.redirect("/auth");
  }
};
module.exports.reset = async function (req, res) {
  //console.log(req.query);
  //console.log("hello");
  let AccessToken = await accessToken.findOne({ token: req.query.accessToken });
  //console.log(AccessToken, "AccessToken");
  if (AccessToken && AccessToken.isValid) {
    //console.log("AccessToken Present");
    //console.log("AccessToken is valid");
    AccessToken.isValid = false;
    //console.log(req.body.password);
    //console.log(req.body.confirm_password);
    if (req.body.password === req.body.confirm_password) {
      //console.log("Password  matchedd");
      let user = await User.findById(AccessToken.user);

      if (user) {
        //console.log("User found", user);
        user.password = req.body.password;
        AccessToken.save();
        user.save();
        //console.log("Password changed", user);
        req.flash("success", "Password Changed");
        return res.redirect("/users/sign-in");
      }
    } else {
      req.flash("error", "Password didnt matched");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Token is Expired ! Pls regenerate it.");
    return res.redirect("/auth");
  }
};
