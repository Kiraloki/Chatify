// import  { Router } from 'express';
// import express from express;

const express = require("express");
const UserModel = require("../models/user");
const { generateToken, asyncHandlerPromise } = require("../utils");
const authorized = require("../middleware/auth");

const userRouter = express.Router();

// Signup

userRouter.post(
  "/signup",
  asyncHandlerPromise(async (req, res) => {
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
  })
);

// Login

userRouter.post(
  "/login",
  asyncHandlerPromise(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Missing req fileds");
    }

    const user = await UserModel.findOne({ email });

    if (user && user.matchPassword(password)) {
      const token = generateToken(user._id);
      res
        .status(200)
        .json({ user: { name: user.name, email: user.email }, token });
    } else {
      res.status(400);
      throw new Error("Invalid credinetials");
    }
  })
);

// Forget Password

userRouter.use(authorized);

// Profile Update ?

userRouter.get("/all", (req, res) => {
  console.log("Users");
  res.send("Hello users");
});

// Search users initally to get stateted

userRouter.get("/users", async (req, res) => {});

module.exports = userRouter;
