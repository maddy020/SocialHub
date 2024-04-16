const Post = require("../models/post");
const User = require("../models/user");
const Friend = require("../models/friend");
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
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: [{ path: "user" }, { path: "likes" }],
      })
      .exec();
    let friends;
    if (req.user) {
      friends = await Friend.find({ from_user: req.user.id }).populate([
        "from_user",
        "to_user",
      ]);
      //console.log("friends", friends);
    }
    //console.log(posts);
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
