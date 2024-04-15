const Friend = require("../models/friend");
const User = require("../models/user");
module.exports.friendship = async function (req, res) {
  try {
    let existingFriend = await Friend.findOne({
      to_user: req.query.id,
      from_user: req.user.id,
    });
    let fromUser = await User.findById(req.user.id);

    let deleted = false;

    if (existingFriend) {
      console.log("already a friend");
      fromUser.friends.pull(existingFriend._id);
      fromUser.save();
      await Friend.findByIdAndDelete(existingFriend._id);
      deleted = true;
    } else {
      console.log("not  a friend");
      let friendship = await Friend.create({
        from_user: req.user.id,
        to_user: req.query.id,
      });

      fromUser.friends.push(friendship);

      fromUser.save();
    }
    if (req.xhr) {
      return res.status(200).json({
        deleted: deleted,
        message: "Request Successful",
      });
    }
    return res.redirect("back");
  } catch (err) {
    console.log("Error while handling friend", err);
  }
};
