const chatModel = require("../models/chat");
const UserModel = require("../models/user");
const { asyncHandlerAsyncAwait } = require("../utils");

const accessChat = asyncHandlerAsyncAwait(async (req, res) => {
  const { userId } = req.body;

  console.log(req.user);

  //fetch exisitng chat and if there populated data
  let Chat = await chatModel
    .find({
      isGroup: false,
      $and: [
        {
          users: { $elemMatch: { $eq: userId } },
        },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
    .populate("users", "-password")
    .populate("lastMessage");

  Chat = await UserModel.populate(Chat, {
    path: "latestMessage.sender",
    select: "name  email",
  });

  if (Chat.length > 0) {
    res.send(Chat[0]);
  } else {
    try {
      const newChat = await chatModel.create({
        isGroup: false,
        chatName: "sender",
        users: [userId, req.user._id],
      });
      const FullChat = await chatModel
        .findOne({ _id: newChat._id })
        .populate("users", "-password");
      res.status(200).json(FullChat);
    } catch (err) {
      console.log(err);
      res.status(400);
      throw new Error(err.message);
    }
  }
});

const createGroupChat = asyncHandlerAsyncAwait(async (req, res) => {
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
});

const fetchChats = asyncHandlerAsyncAwait(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandlerAsyncAwait(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandlerAsyncAwait(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandlerAsyncAwait(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  createGroupChat,
  fetchChats,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
