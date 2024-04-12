const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.create = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    if (post) {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
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
    return res.redirect("back");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
