const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  try {
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
        },
      });
    res.status(200).json({
      message: "List of Posts",
      posts: posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
module.exports.destroy = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Assuming you are going to check if the user is authorized to delete this post
    if (post && post.user == req.user.id) {
      await Post.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ post: req.params.id });

      res.status(200).json({
        message: "Post and associated comments deleted!",
      });
    } else {
      res.status(401).json({
        message: "You cannot delete this post",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
