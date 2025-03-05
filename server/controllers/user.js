const UserModel = require("../models/user");
const { asyncHandlerPromise, generateToken } = require("../utils");

const signup = asyncHandlerPromise(async (req, res) => {
  const { name, email, password } = req.body;
  // validate
  if (!name || !email || !password) {
    res.status(404);
    throw new Error("Please enter all feilds");
  }
  // check existing
  const existingUser = await UserModel.findOne({ email: email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  try {
    const user = await UserModel.create({ name, email, password });

    console.log(user);

    const authToken = generateToken(user._id);

    res.status(201).json({
      user: { name: user.name, email: user.email },
      token: authToken,
    });
  } catch (err) {
    res.status(400);
    throw new Error("User not found");
  }
});

const login = asyncHandlerPromise(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Missing req fileds");
  }

  const user = await UserModel.findOne({ email });

  console.log(user);
  console.log(user.matchPassword(password));

  if (user && user.matchPassword(password)) {
    const token = generateToken(user._id);
    res
      .status(200)
      .json({ user: { name: user.name, email: user.email }, token });
  } else {
    res.status(400);
    throw new Error("Invalid credinetials");
  }
});

const allUsers = asyncHandlerPromise(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { signup, login, allUsers };
