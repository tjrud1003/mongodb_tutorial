const { Router } = require("express");
const userRouter = Router();
const {User , Blog , Comment} = require('../models')
const mongoose = require("mongoose");


userRouter.get('/' ,async (req,res)=>{
  try{
    const users = await User.find({});
    return res.send({users})
  }catch(err){
    console.log(err)
    return res.status(500).send({err:err.message})
  }
})

userRouter.get('/:userId' , async(req,res)=>{
  try{
    const {userId} = req.params;
    if(!mongoose.isValidObjectId(userId)) return res.status(400).send({err:"invalid userID"}) // ObjectId 확인용
    const user = await User.findOne({_id:userId});
    return res.send({user})
  }catch(err){
    console.log(err)
    return res.status(500).send({err:err.message})
  }
})

userRouter.post('/' , async(req,res)=>{
  try{
    // 예외처리
    let {username , name} = req.body; // 한방에 변수 선언
    if(!username)return res.status(400).send({err:"username is required"});
    if(!name ||!name.first || !name.last)return res.status(400).send({err:"Both first and last names are required"});

    const user = new User(req.body);
    await user.save();
    return res.send({user})
  }catch(err){
    console.log(err);
    return res.status(500).send({err:err.message})
  }
})

userRouter.delete('/:userId',async(req,res)=>{
  try{
    const {userId} = req.params
    if(!mongoose.isValidObjectId(userId))return res.status(400).send.message({err:"invalid userId"})
    const user = await Promise.all([
      User.findOneAndDelete({_id:userId}),
      Blog.deleteMany({"user._id":userId}),
      Blog.deleteMany({
        "comments.user":userId} , 
        {$pull:{comments:{user:userId}}}
        ),
      Comment.deleteMany({user:userId}) 
    ])




    return res.send({user})
  }catch(err){
    console.log(err);
    return res.status(500).send({err:err.message})
  }

})

userRouter.put('/:userId',async(req,res)=>{
  try{
    const {userId} = req.params;
    if(!mongoose.isValidObjectId(userId))return res.status(400).send.message({err:"invalid userId"})
    const {age,name} = req.body;
    if(!age && !name) return res.status(400).send({err:"age and name is required"});
    if(!age) return res.status(400).send({err:"age is required"})
    if(age &&typeof age !== 'number') return res.status(400).send({err:"age must be a number"});
    if(name &&typeof name.first !== 'string'&&typeof name.last !== 'string') return res.status(400).send({err:"first and last anme are not string"});
    // let updateBody = {};
    // if(age) updateBody.age = age; // 값이 있을때만 업데이트 
    // if(name) updateBody.name = name;  // 값이 있을때만 업데이트 

    // const user = await User.findByIdAndUpdate(userId,{age,name}, {new:true},);//  {new:true} 수정완료된 데이터받음 
    let user = await User.findById(userId); // 업데이트 전내용
    console.log({userBeforeEdit:user});
    if(age) user.age = age; 
    if(name){ 
      user.name = name;
      await Promise.all([
        Blog.updateMany(
          {"user._id":userId} ,
          {"user.name":name}
          ),
          Blog.updateMany(
            {} ,
            {"comments.$[comment].userFullName":`${name.first} ${name.last}`},
            {arrayFilters:[{"comment.user":userId}]}
          )
      ]);
    }
    console.log({userAfterEdit:user}); // 업데이트 후 내용
    await user.save(); // 수정 할 부분만 수정 요청 
    return res.send({user})
  }catch(err){
    console.log(err)
    return res.status(500).send({err:err.message})
  }
})

module.exports = {
  userRouter
}