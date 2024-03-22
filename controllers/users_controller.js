const User = require("../models/user");
module.exports.profile = async (req, res) => {
  try {
    res.end("<h1>Hre Krishna...</h1>");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.signUp = async (req, res) => {
  try {
    res.render("user_sign_up", { title: "SocialHub | Sign Up" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.signIn = async (req, res) => {
  try {
    res.render("user_sign_in", { title: "SocialHub | Sign In" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.create = async (req, res) => {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    console.log("error while signing up the user");
    res.status(500).send("Internal Server Error");
  }
};
module.exports.createSession = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
