const express = require("express");
const router = express.Router();
const forgetPassword = require("../controllers/auth_controller");
router.get("/", forgetPassword.open);
router.post("/verify-email", forgetPassword.find);
router.get("/reset-password", forgetPassword.newPassword);
router.post("/reset", forgetPassword.reset);
module.exports = router;
