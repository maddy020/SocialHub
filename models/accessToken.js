const mongoose = require("mongoose");
const accessTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);
const accessToken = mongoose.model("accessToken", accessTokenSchema);
module.exports = accessToken;
