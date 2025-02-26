const express = require("express");
const { asyncHandlerAsyncAwait } = require("../utils");
const { chatModel } = require("../models/chat");

const chatrouter = express.Router();

// create group / new chat

chatrouter.post(
  "/chat",
  asyncHandlerAsyncAwait(async (req, res) => {
    const { chatName, isGroup, users } = req.body;

    try {
      const newChat = await chatModel.create({
        chatName: chatName,
        isGroup: isGroup,
        users: users,
        groupAdmin: req.user,
      });

      res.status(200).json({ newChat });
    } catch (err) {
      res.status(500);
      throw new Error(err.message);
    }
  })
);

// edit group (add/remove group change admin)

chatrouter.post(
  "/chat/:chatId",
  asyncHandlerAsyncAwait(async (req, res) => {
    const chatId = req.params.chatId;
    const { chatName, isGroup, users } = req.body;
    const existingChat = await chatModel.find({ _id: chatId });

    existingChat.chatName = chatName;
    existingChat.isGroup = isGroup;
    existingChat.users = users;

    existingChat.save();

    try {
      const newChat = await chatModel.create({
        chatName: chatName,
        isGroup: isGroup,
        users: users,
        groupAdmin: req.user,
      });

      res.status(200).json({ newChat });
    } catch (err) {
      res.status(500);
      throw new Error(err.message);
    }
  })
);

// rename
// add usrs
// remove users

// fetch all chats of user and get with search query
chatrouter.get(
  "/chats",
  asyncHandlerAsyncAwait(async (req, res) => {
    const chatName = req.query.search;
    const existingChats = await chatModel.find({ chatName });

    existingChat.chatName = chatName;
    existingChat.isGroup = isGroup;
    existingChat.users = users;

    existingChat.save();

    try {
      const newChat = await chatModel.create({
        chatName: chatName,
        isGroup: isGroup,
        users: users,
        groupAdmin: req.user,
      });

      res.status(200).json({ newChat });
    } catch (err) {
      res.status(500);
      throw new Error(err.message);
    }
  })
);

module.exports = chatrouter;
