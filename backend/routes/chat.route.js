const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  getOrCreateChat,
  getAllChat,
  createGroupChat,
  renameChatGroup,
  addToGroup,
  removeUser,
} = require("../controllers/chat.controller");

const router = express.Router();
router.route("/").post(auth, getOrCreateChat).get(auth, getAllChat);
router.route("/group-chat").post(auth, createGroupChat);
router.route("/rename-chat").put(auth, renameChatGroup);
router.route("/add-to-chat").put(auth, addToGroup);
router.route("/remove-user").put(auth, removeUser);
module.exports = router;
