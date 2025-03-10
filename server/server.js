const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const { notFound, errorHandler } = require("./middleware/error");
const authorized = require("./middleware/auth");
const { connectToDb } = require("./utils");
const { Server } = require("socket.io");
const app = express();

dotenv.config();

connectToDb();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yo World");
});

app.use("/api/v1/users", userRouter);
app.use(authorized);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);
// chats
// messages

app.use(notFound);
app.use(errorHandler);

const server = app.listen("3000", console.log("Serevr running on port 3000"));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
