const express = require("express");
const router = express.Router();
const postLikeController = require("../controllers/likes_controller");

router.post("/toggle", postLikeController.toggleLike);
module.exports = router;
