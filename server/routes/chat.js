const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chats");

const chatrouter = express.Router();

chatrouter.post("/", accessChat);
// chatrouter.route("/").post(accessChat);
chatrouter.get("/", fetchChats);
chatrouter.post("/group", createGroupChat);
chatrouter.put("/rename", renameGroup);
chatrouter.put("/groupremove", removeFromGroup);
chatrouter.put("/groupadd", addToGroup);

module.exports = chatrouter;
