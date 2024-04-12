const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);
    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      if (comment) {
        post.comments.push(comment);
        post.save();
        res.redirect("back");
      }
    }
  } catch (err) {
    console.error("comment", err);
    return res.status(500).send("Internal Server Error");
  }
};
module.exports.destroy = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const post = await Post.findById(comment.post);
    if (comment && (comment.user == req.user.id || post.user == req.user.id)) {
      console.log("hello");
      const postId = comment.post;
      await Comment.findByIdAndDelete(req.params.id);
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      return res.redirect("back");
    }
  } catch (err) {
    console.error("comment", err);
    return res.status(500).send("Internal Server Error");
  }
};
