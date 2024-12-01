const jwt = require("jsonwebtoken");
const generateToken = async (id) => {
  return jwt.sign({ id }, "chat-app", {
    expiresIn: "30d",
  });
};
module.exports = generateToken;
