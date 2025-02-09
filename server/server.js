const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const app = express()

dotenv.config()


const connectToDb = async()=>{
  try{
    const connection = await mongoose.connect(process.env.MONGO_URI,{
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: true,
    })

    // console.log(connection)
    // console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
      console.log(`MongoDB Connection Successful `);
  }

  catch(err){
    console.error(err)
  }

}



connectToDb()

app.use(express.json()); 
app.use("/api/v1/users",userRouter)
// chats  
// messages 


app.get('/',  (req, res) =>{
  res.send('Yo World')
})



app.listen('3000', console.log("Serevr running on port 3000"))