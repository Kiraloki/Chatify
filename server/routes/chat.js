const express = require('express'); 
const { asyncHandlerAsyncAwait } = require('../utils');
const { chatModel } = require('../models/chat');


const chatrouter = express.Router(); 



// create group / new chat  


chatrouter.post("/chat", asyncHandlerAsyncAwait(async(req, res)=>{
    const { chatName,isGroup, users} = req.body 

    try 
    {

        const newChat = await chatModel.create({
            chatName: chatName,
            isGroup: isGroup,
            users: users, 
            groupAdmin: req.user
        })
    
        res.status(200).json({newChat})
    }

    catch(err){
        res.status(500)
        throw new Error(err.message)

    }



}))

// edit group (update last message, add/remove group change admin) 


// fetch all chats of user and get with search query 


module.exports = chatrouter



