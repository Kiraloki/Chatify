const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroup: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
