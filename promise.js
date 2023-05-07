const addSum = (a,b) => new Promise((resolve,reject)=>{
  setTimeout(()=>{
    if(typeof a !=='number'||typeof b!=='number') reject('a , b must be numbers')
    resolve(a+b)
  },3000)
})


// addSum(10,20)
// .then((sum1)=>{ // sum1 결과 값 
//   console.log({sum1})
//   return addSum(sum1,1)
// })
// .then((sum1)=> addSum(sum1,1))
// .then((sum1)=> addSum(sum1,1))
// .then((sum1)=> addSum(sum1,1))
// .then((sum1)=> addSum(sum1,1))
// .then((sum2)=>console.log({sum2}))
// .catch((error)=>console.log({error}))


const totalSum = async(inputa,inputb) => {
  try{
    let sum = await addSum(inputa,inputb)
    let sum2 = await addSum(sum,inputb)
    console.log({sum , sum2})
  }catch(err){

  }
}
totalSum(10,11);