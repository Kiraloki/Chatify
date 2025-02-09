// import  { Router } from 'express';
// import express from express;

const express = require('express');
const { UserModel } = require('../models/user');

const userRouter = express.Router()

// const userRouter = new Router(); 


userRouter.get("/all", (req, res) => {
    console.log("Users")
    res.send("Hello users")
})

// Signup  

userRouter.post("/signup", async(req, res) =>{
    const {name ,  email , password} = req.body 
    // validate  
    if(!name || !email || !password){
        res.status(404) 
        throw new Error("Please enter all feilds")
    }
    // check existing 
    const existingUser = await UserModel.findOne({email: email})

    if(existingUser){
        res.status(400) 
        throw new Error("User already exists")
    }


try{
    const user = await  UserModel.create({name, email, password});
        // create token 

    const authToken =     jwt.sign({ user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

    

    res.status(201).json({...user, token});;
} 

catch(err){
    res.status(400);
    throw new Error("User not found");
}
}
)
// Login  





// Forget Password  


// Profile Update ?


// Search users initally to get stateted

module.exports = userRouter;

