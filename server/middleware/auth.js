const jwt = require("jsonwebtoken");
const { asyncHandlerPromise } = require("../utils");
const UserModel = require("../models/user");

const authorized = asyncHandlerPromise(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startswith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized - invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized - no token");
  }
});

module.exports = authorized;
