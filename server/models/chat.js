import mongoose, { Schema  } from "mongoose";  

const chatSchema = new Schema({
    chatName : { type : String , trim : true },
    isGroup : {type : Boolean, default : false}, 
    users : [{type : mongoose.Schema.Types.ObjectId, ref :"User"}],
    lastMessage : {type : String}, 
    groupAdmin :{type : mongoose.Schema.Types.ObjectId , ref : "User"}
}, { timestamps: true })



export const  chatModel = mongoose.model("Chat", chatSchema)