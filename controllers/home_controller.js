const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async (req, res) => {
  try {
    /* const posts = await Post.find({});
    if (posts) {
      return res.render("home", {
        title: "SocialHub | Home",
        posts: posts,
      });
    } */
    const posts = await Post.find({})
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .exec();
    if (posts) {
      const users = await User.find({});
      if (users) {
        return res.render("home", {
          title: "SocialHub | Home",
          posts: posts,
          all_users: users,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
