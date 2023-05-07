express = require('express');
const app = express();
const users = ["a"]
const mongoose = require("mongoose")
const {userRouter, blogRouter } = require("./routes");
const { generateFakeData } = require('../faker2');

// const MONGO_URI ="mongodb+srv://admin:123456789aA!@mongodbtutorial.vkckldg.mongodb.net/BlogartService?retryWrites=true&w=majority"




const server = async()=>{
  try{
    const {MONGO_URI , PORT} = process.env;
  if(!MONGO_URI) throw new Error("MONGO_URI is required!!")
  if(!PORT) throw new Error("PORT is required!!")


    await mongoose.mongoose.connect(MONGO_URI, 
      {
        useUnifiedTopology: true,
      }); // DB 연결
    // mongoose.set("debug",true) // mongoose 모든 쿼리 확인 
    console.log("Mongodb connected");
    app.use(express.json())
    app.use('/blog', blogRouter)
    app.use('/user', userRouter)

    app.listen(PORT,()=> console.log(`server listening on port ${PORT}`));
    // for(let i =0;i<20;i++){ // 데이터 추가 한번에 데이터 요청시 과부하 발생
    // console.time("insert time");
    // await generateFakeData(10,2,10);
    // console.timeEnd("insert time");

    // }


  }catch(err){
    console.log(err)
  }
}
server();