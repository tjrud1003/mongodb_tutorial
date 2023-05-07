const {Schema , Types:{ObjectId} , model}=require("mongoose")


const CommentSchema = new Schema(
  {
    content :{type:String, required:true},
    user:{type:ObjectId, required:true,ref:"user" , inedx:true},
    userFullName:{type:String , required:true},
    blog:{type:ObjectId , required:true , ref:"blog"},

  },{timestamps:true}
)

CommentSchema.index({blog:1,createdAt:-1});
const Comment = model('comment' , CommentSchema)
module.exports = {Comment , CommentSchema} // 내보내는 데이터 