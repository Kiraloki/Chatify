const { asyncHandlerPromise } = require("../utils");

const allMessages = asyncHandlerPromise(async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await MessageModel.find({ chatId })
      .populate("sender", "name email")
      .populate("chatId");
    res.status(200).json({ messages: messages });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const sendMessage = asyncHandlerPromise(async (req, res) => {
  const { message, chatId } = req.body;
  // check chatid valid ?
  try {
    const newMessage = await MessageModel.create({
      sender: req.user._id,
      content: message,
      chatId: chatId,
    });

    await chatModel.findByIdAndUpdate(req.body.chatId, {
      lastMessage: newMessage._id,
    });

    res.status(200).json(newMessage);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = { allMessages, sendMessage };
