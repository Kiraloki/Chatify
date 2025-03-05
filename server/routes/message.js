const express = require("express");
const { sendMessage, allMessages } = require("../controllers/messages");

const messageRouter = express.Router();

// send a message to chat

messageRouter.post("/newMessage", sendMessage);

// update read by

// fetch all messages of a chat

messageRouter.get("/:chatId", allMessages);

module.exports = messageRouter;
