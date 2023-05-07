// const addSum = function(a,b,callback){ // callback 함수 
//   setTimeout(function(){
//     if(typeof a !=='number' || typeof b !== 'number') callback('a,b must be numbers');
//     callback(undefined,a+b)
//   },3000);
// }

const addSum = (a,b,callback) =>{ // callback 함수 
  setTimeout(function(){
    if(typeof a !=='number' || typeof b !== 'number') {
      return callback('a,b must be numbers');
    }
    callback(undefined,a+b)
  },3000);
}

// let callback = 
addSum(10,10,(error , sum1)=>{
  if(error) return console.log({error});
  console.log({sum1})
  addSum(sum1,15,(error,sum2)=>{
    if(error) return console.log({error});
    console.log({sum2})

  })
})