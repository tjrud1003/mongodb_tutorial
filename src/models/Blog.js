const {Schema , model , Types} = require("mongoose");
const {CommentSchema} = require('./Comment')
const BlogSchema = new Schema({
  title :{type:String,required:true},
  content :{type:String,required:true},
  islive :{type:Boolean,required:true , default:false}, // true면 고객 노출, false  고객 안노출 
  user:{
    _id:{type:Types.ObjectId , required:true , ref:"user" },
    username:{type:String,required:true},
    name:{
      first:{type:String , required:true},
      last:{type:String , required:true},
    }
  },
  commentsCount :{type:Number, default:0 , required:true}, // comment 총 개수 
  comments:[],
  
  // user:{type:Types.ObjectId , required:true , ref:"user"}// ref:"user" = const User = model('user',UserSchema) 값 식별

},{timestamps:true});
BlogSchema.index({'user._id':1 , updatedAt:1}) // mogoose상 인덱스 생성 // 오타 있을시 생성되지 않음
BlogSchema.index({title:"text"}) // mogoose상 인덱스 생성 


// BlogSchema.virtual("comments",{ //  가상 필드 
//   ref:"comment" ,  
//   localField:"_id", // comment의 _id
//   foreignField:"blog" // comment와blog 매칭할 키데이터 
// });

BlogSchema.set("toObject",{virtuals:true});
BlogSchema.set("toJSON",{virtuals:true});

const Blog = model('blog' , BlogSchema); // db 데이터 연결 키
module.exports = {Blog}