const User = require("../models/user");
module.exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.render("user_profile", {
        title: "SocialHub | Profile",
        profile_user: user,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update = async (req, res) => {
  try {
    console.log("yes");
    if (req.user.id == req.params.id) {
      await User.findByIdAndUpdate(req.params.id, req.body);
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
module.exports.signUp = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  try {
    return res.render("user_sign_up", { title: "SocialHub | Sign Up" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.signIn = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/users/profile");
    }
    return res.render("user_sign_in", { title: "SocialHub | Sign In" });
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
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.destroySession = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/");
    });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send("Internal Server Error");
  }
};
