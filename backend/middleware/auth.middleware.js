const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, "chat-app");
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
    }
  }
};
module.exports = auth;
