const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.create = async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);
    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      const user = await User.findById(req.user._id);
      if (comment) {
        post.comments.push(comment);
        post.save();
        if (req.xhr) {
          return res.status(200).json({
            data: {
              comment: comment,
              user: user,
            },
            message: "Comment Created!",
          });
        }
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
      const postId = comment.post;
      await Comment.findByIdAndDelete(req.params.id);
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }
      return res.redirect("back");
    }
  } catch (err) {
    console.error("comment", err);
    return res.status(500).send("Internal Server Error");
  }
};
