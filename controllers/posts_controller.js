const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
module.exports.create = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    const user = await User.findById(req.user._id);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
          user: user,
        },
        message: "Post Created!",
      });
    }
    if (post) {
      req.flash("success", "Post Published");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post && post.user == req.user.id) {
      await Post.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ post: req.params.id });
    }
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post_id: req.params.id,
        },
        message: "Post deleted",
      });
    }
    req.flash("success", "Post Deleted");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    return res.status(500).send("Internal Server Error");
  }
};
