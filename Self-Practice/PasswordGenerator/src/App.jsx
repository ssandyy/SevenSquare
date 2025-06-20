import { useCallback, useEffect, useState } from 'react'
import './App.css'

function App() {
  const[length, setLength] = useState(8)
  const[numCheck, setNumCheck] = useState(false)
  const[specialCharCheck, setspecialCharCheck] = useState(false)
  const[password, setPassword] = useState("")

  // const passwordGenerator = useCallback(() => {}, [length, specialCharCheck, numCheck, setPassword]) 
 
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if(numCheck){  // if numbers is allowed then concat with string
      return str+= "0123456789"
    }
    if (specialCharCheck) str += "!#$%&'()*+,-./:;<=>?@[]^_`{|}~" ; // same line doesnot need return decleration

    for (let i = 0; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }
    setPassword(pass)
  }, [length, specialCharCheck, numCheck, setPassword]) 


  useEffect(() => {
    passwordGenerator()
  }, [length, specialCharCheck, numCheck, passwordGenerator])

  return (
    <>
    <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 m-8 text-orange-500 bg-black'>
      <h2>Password Generator </h2>
      <div className='flex shadow rounded-lg overflow-hidden mb-4'>
        
        <input 
        type="text"
        value={password}
        className="outline-none w-full p-1 px-3"
        placeholder='Generated Password..'
        />
        <button>Copy</button>
      </div>
      
      <div className='flex text-sm gap-3 items-center'>
        <input 
          type="range" 
          min={6}
          max={100}
          value={length}
          className='cursor-pointer'
          onChange={(events) => setLength(events.target.value)}
        />
        <label htmlFor="">{length}</label>

        <input 
          type="checkbox"
          defaultChecked={numCheck}
          className='cursor-pointer'
          onClick={() => setNumCheck((prev) => !prev)}   
        />
         <label htmlFor="numberInput">Number </label>

        <input 
          type="checkbox" 
          defaultChecked={specialCharCheck} 
          className='cursor-pointer' 
          onClick={() => setspecialCharCheck((prev) => !prev)}
        />
        <label htmlFor="special character generator" >Special Character</label>

      </div>
      <div className="flex flex-wrap text-sm gap-3 items-center">

      </div>
    </div>
    </>
  )
}

export default App