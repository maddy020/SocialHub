const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentsEmailWorker = require("../workers/comment_email_worker");
const Like = require("../models/like");
module.exports.create = async (req, res) => {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      // Populate directly after creation and reassign to comment
      comment = await comment.populate(["user , likes"]);
      post = await Post.findById(req.body.post).populate("user", "name email");
      //commentsMailer.newComment(comment);
      //commentsMailer.newComment(post, comment);
      const job = queue
        .create("emails", { post, comment })
        .save(function (err) {
          if (err) {
            console.log("error in creating queue!", err);
            return;
          }
          //console.log(job.id, "manika");
        });
      const user = await User.findById(req.user._id);

      post.comments.push(comment);
      await post.save();

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment Created!",
        });
      }
      res.redirect("back");
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.error("Error in creating comment", err);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const post = await Post.findById(comment.post);
    if (comment && (comment.user == req.user.id || post.user == req.user.id)) {
      const postId = comment.post;
      await Like.deleteMany({ likeable: comment, onModel: "Comment" });
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
