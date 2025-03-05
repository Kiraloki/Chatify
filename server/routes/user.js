// import  { Router } from 'express';
// import express from express;

const express = require("express");
const authorized = require("../middleware/auth");
const { signup, login, allUsers } = require("../controllers/user");

const userRouter = express.Router();

// Signup

userRouter.post("/signup", signup);

// Login

userRouter.post("/login", login);

// Forget Password

userRouter.use(authorized);

// Profile Update ?

userRouter.get("/all", allUsers);

// Search users initally to get stateted

module.exports = userRouter;
