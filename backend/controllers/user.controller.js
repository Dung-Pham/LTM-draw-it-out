import { User } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";

const userArr = [];

const getUserById = (userId) => {
  const user = userArr.find((item) => item.userId === userId);
  return user || null;
};

const createUser = (username, isAdmin, status, ws) => {
  const userId = uuidv4();
  const user = new User(userId, username, false, 0, status, "", isAdmin);
  userArr.push(user);

  return ws.send(JSON.stringify(user));
};

export { createUser, getUserById };
