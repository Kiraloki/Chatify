const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const { notFound, errorHandler } = require('./middleware/error');
const { authorized } = require('./middleware/auth');
const app = express()

dotenv.config()






connectToDb()

app.use(express.json()); 


app.get('/',  (req, res) =>{
  res.send('Yo World')
})



app.use("/api/v1/users",userRouter)
app.use(authorized)
// chats  
// messages 


app.use(notFound) 
app.get(errorHandler)


app.listen('3000', console.log("Serevr running on port 3000"))