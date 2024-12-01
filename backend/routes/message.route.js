const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  sendMessage,
  getMessageByIdChat,
} = require("../controllers/message.controller");
const router = express.Router();
router.route("/").post(auth, sendMessage);
router.route("/:chatId").get(auth, getMessageByIdChat);

module.exports = router;
