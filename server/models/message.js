import mongoose,{ Schema } from "mongoose";

const messageSchema = new Schema({
    sender : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
    content : {type : String}, 
    chatId : {type : mongoose.Schema.Types.ObjectId , ref : 'Chat'}, 
    readBy : [{type : mongoose.Schema.Types.ObjectId ,ref:"User"}],

    },{ timestamps: true }) 


export const MessageModel = mongoose.model("Message", messageSchema)