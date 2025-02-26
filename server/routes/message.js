const express = require("express");
const { asyncHandlerPromise } = require("../utils");
const { MessageModel } = require("../models/message");

const messageRouter = express.Router();

// send a message to chat

messageRouter.post(
  "/newMessage",
  asyncHandlerPromise(async (req, res) => {
    const { message, chatId } = req.body;
    // check chatid valid ?
    try {
      const res = await MessageModel.create({
        sender: req.user.id,
        content: message,
        chatId: chatId,
      });
      res.status(200).json({ message: "Message sent successfully" });

      // update last message in chat
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

// update read by

// fetch all messages of a chat

messageRouter.get(
  "/:chatId",
  asyncHandlerPromise(async (req, res) => {
    const { chatId } = req.params;
    try {
      const messages = await MessageModel.find({ chatId });
      res.status(200).json({ messages: messages });
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

module.exports = messageRouter;
