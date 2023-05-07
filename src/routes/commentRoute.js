const {Router} = require("express");
const commentRouter = Router({mergeParams:true}); //  라우터 true 시 하위 파라미터까지 호출 
const {Comment , Blog , User} = require("../models");
const { isValidObjectId , startSession } = require("mongoose");


commentRouter.post('/' ,async(req,res)=>{
  const session = await startSession();
  let comment;
  try{
    // await session.withTransaction(async() =>{
    const {blogId} = req.params;
    const {content , userId} = req.body;
    if(!isValidObjectId(blogId)) return res.status(400).send({err:"blogId is invalid"})
    if(!isValidObjectId(userId)) return res.status(400).send({err:"userId is invalid"})
    if(typeof content !== 'string') return res.status(400).send({err:"content is requried"})
    const [blog , user] =await Promise.all([ // 동시 호출로 속도 줄임
      Blog.findById(blogId,{}),//       Blog.findById(blogId,{},{session}),
      User.findById(userId , {}) //       User.findById(userId , {}, {session})
    ])

    if(!blog||!user) return res.status(400).send({err:"blog or user dose not exist"})
    if(!blog.islive) return res.status(400).send({err:"islive is not available"})

    comment = new Comment({
      content,
      user,
      userFullName:`${user.name.first} ${user.name.last}`, 
      blog :blogId
    }); //  넣을 데이터
      // await session.abortTransaction() //  세션내 작업했던 모든 내용을 원복 시킨다
    // await Promise.all([ // 내장
    //    comment.save(),
    //    Blog.updateO`  ne({_id:blogId},{$push:{comments:comment}})
    // ]);

    // 세션 방식 
    // blog.commentsCount++;
    // blog.comments.push(comment);
    // if(blog.commentsCount>3)blog.comments.shift(); // .shift();; // comments 제일 초기에 들어온 데이터 배출 

    // await Promise.all([
    //   comment.save({session}) , 
    //   blog.save()]) // session 을통해 호출해  session이 내장되어있다. 
      // Blog.updateOne({_id:blogId},{$inc:{commentsCount:1}})]); // inc 업데이트 해당필드에 +1시킨다. 
    // }) // withTransaction

    await Promise.all([comment.save(),Blog.updateOne({_id:blogId},{$inc:{commentsCount:1} , $push:{comments:{$each:[comment] , $slice:-3}}})]) // 가장 최근 데이터 3개만 저장해둔다. 
    return res.send({comment})
    
  }catch(err){
    return res.status(400).send({err:err.message})
  } finally{
    // await session.endSession();
  }
})
commentRouter.get('/',async(req,res) =>{
  let {page=0} = req.query;
  console.log("check : page : ",page);
  page = parseInt(page);
  const {blogId} = req.params;
  if(!isValidObjectId(blogId)) return res.status(400).send({err:"blogId is invalid"});

  // const comments = await Comment.find({ blog:blogId}) //내장 함수용 원본
  // 부분 내장 함수 pagination
  const comments = await Comment.find({ blog:blogId})
  .sort({createdAt:-1})
  .skip(page*3)
  .limit(3);


  return res.send({comments})
})



commentRouter.patch('/:commentId',async(req,res) =>{
  const {commentId} = req.params;
  const {content} = req.body;
  if(typeof content!=="string") return res.status(400).send({err:"content is required"});
  const [comment] = await Promise.all([
    Comment.findOneAndUpdate(
      {_id:commentId} ,
      {content} ,
      {new :true}
    ),
    Blog.findOneAndUpdate(
      {"comment._id":commentId},
      {"comments.$.content":content}
    ) // _id에 해당하는 comments[n] 의 배열 데이터 
  ]) 
  
  return res.send({comment});

})


commentRouter.delete('/:commentId' ,async(req,res)=>{
  const {commentId} = req.params;
  const comment = await Comment.findOneAndDelete({_id:commentId})
  await Blog.updateOne({"comments._id":commentId}  , {$pull:{comments:{_id:commentId}}}
  );
  return res.send({comment});

})


module.exports = {commentRouter}