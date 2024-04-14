const User = require("../models/user");
const fs = require("fs");
const path = require("path");
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
    let user = await User.findById(req.params.id);
    User.uploadedAvatar(req, res, function (err) {
      if (err) {
        console.log("Multer Err", err);
      }
      user.name = req.body.name;
      user.email = req.body.email;
      if (req.file) {
        if (user.avatar) {
          const avatarPath = path.join(__dirname, "..", user.avatar);

          try {
            if (fs.existsSync(avatarPath)) {
              fs.unlinkSync(avatarPath);
            }
          } catch (error) {
            console.error("Error deleting avatar:", error);
          }
        }

        user.avatar = User.avatarPath + "/" + req.file.filename;
        avatarPath = path.join(__dirname, "..", user.avatar);
        if (fs.existsSync(avatarPath) == false) {
          user.avatar = NULL;
        }
      }
      user.save();
      return res.redirect("back");
    });
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
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.destroySession = async (req, res, next) => {
  try {
    req.logOut(function (err) {
      if (err) {
        return next(err);
      }
      // Set the flash message after successfully logging out
      req.flash("success", "Logged out!");
      // Then redirect
      return res.redirect("/users/sign-in");
    });
    // Note: req.session.destroy() is not called explicitly here. If needed, ensure it happens after setting flash
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send("Internal Server Error");
  }
};
