const {Schema ,model} = require('mongoose');
const UserSchema = new Schema({ // 스키마 데이터양식 선언 
  username:{type:String, require:true , unique:true}, // required 필수 데이터 , unique 유일키  
  name:{
    first:{type:String , required:true},
    last:{type:String , required:true},
  },
  age:{type:Number,index:true},
  email:String
},{timestamps:true})
const User = model('user',UserSchema)
module.exports = {User}