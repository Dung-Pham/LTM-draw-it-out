const express = require("express");
const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const router = express.Router();
router.route("/").post(registerUser).get(auth, allUser);
router.route("/login").post(authUser);

module.exports = router;
