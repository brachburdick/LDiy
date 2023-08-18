//import { json } from 'express';
import React from 'react';

const BelowStage = () => {

const fetchWithAsync = async(path) =>{
  const response = await fetch(`http://localhost:3333${path}`);
  if(!response.ok){
    throw new Error('network response not ok')
  }
  return await response.json()
}

// const handleClick = () => {
  
// }


// const handleClick =  async (path) =>{
//   console.log('handleClick')

//   try{
//     const data = await fetchWithAsync(path);
//     console.log('data from server: ' , data)
//   } catch (error) {
//     console.log('problem: ', error.message)
//   }
// }

// const handleOtherClick = async (path) =>{
//   const response =  await fetch(`http://localhost:3333${path}`)
//   console.log('post other handleClick response')
//   console.log(response)
// }

    return (    
    <div>
        {/* <button id = 'testButton' onClick={() => handleOtherClick('/')}>Add Fixture</button>
        <button id = 'testButton' onClick={() => handleClick('/contact')}>Add Group</button>
        <button id = 'testButton' onClick={() => handleClick('/retrieve')}>Add Animation</button>
        <button id = 'testButton' onClick={() => handleClick('/disconnect')}>Reset Stage</button> */}
      </div>)
}




export default BelowStage