const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Like = require("../models/like");
module.exports.create = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    let post_ = await post.populate(["user , likes"]);

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post_,
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
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      const commentIds = post.comments.map((comment) => comment._id);

      // Delete likes where the 'likeable' field matches any of these comment IDs and 'onModel' is 'Comment'
      await Like.deleteMany({
        likeable: { $in: commentIds },
        onModel: "Comment",
      });
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
