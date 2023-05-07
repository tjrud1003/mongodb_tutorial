console.log("client code running.");
const axios = require("axios");

const URI = "http://localhost:3000";
const test = async() =>{
  console.time("loading time: ");

  // const {data :{blogs},} = await axios.get("http://127.0.0.1:3000/blog")

  let {
    data :{blogs},
  } = await axios.get(`${URI}/blog`);
  console.log(blogs[0]);

  // blogs = await Promise.all(
  //   blogs.map( async (blog)=>{
  //   const [res1,res2] = await Promise.all([ await axios.get(`${URI}/user/${blog.user}`) ,await axios.get(`${URI}/blog/${blog._id}/comment`)])
  //   blog.user = res1.data.user;
  //   blog.comments = await Promise.all(res2.data.comments.map(async comment =>{ // comment 정보 기반 user 조회 후 blog.comment에 정보 추가
  //     const {data:{user}} = await axios.get(`${URI}/user/${comment.user}`)
  //     comment.user = user
  //     return comment;
  //   }))
  //   return blog;
  // }))
  console.log("check st")
  console.dir(blogs[0] , {depth:10})
  console.log("check ed")
  console.timeEnd("loading time: ");
};

const testgroup = async()=>{
  await test();
}
testgroup();