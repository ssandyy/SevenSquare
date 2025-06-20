import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const[length, setLength] = useState(8)
  const[numCheck, setNumCheck] = useState(false)
  const[specialCharCheck, setspecialCharCheck] = useState(true)
  const[password, setPassword] = useState("")

  const passwordRef = useRef(null);
  

  // const passwordGenerator = useCallback(() => {}, [length, specialCharCheck, numCheck, setPassword]) 
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if(numCheck) str += "0123456789"
    if (specialCharCheck) str += "!#$%&'()*+,-./:;<=>?@[]^_`{|}~"

    for (let i = 0; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }
    setPassword(pass)

  }, [length, specialCharCheck, numCheck, setPassword]) 

  const copyClipBoard = useCallback(() => {
      passwordRef.current?.select() // this will give effect of selected value.. !
      window.navigator.clipboard.writeText(password)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numCheck, specialCharCheck, passwordGenerator])

  return (
    <>
    <div className='w-full max-w-ld mx-auto shadow-md rounded-lg px-4 m-8 bg-grey-600'>
      <h1>Password Generators </h1>
      <div className='flex shadow rounded-lg overflow-hidden mb-4 text-orange-500 bg-lime-300'>
        <input 
        type="text"
        value={password}
        ref={passwordRef}
        className="outline-none w-full p-1 px-3"
        placeholder='Generated Password..'
        />
        <button 
          style={{background: "green"}}
          
          className='outline-none bg-blue-700 text-white py-3 px-2'
          onClick={copyClipBoard}
          > Copy</button>
      </div>
      <div className='flex text-sm gap-3 items-center'>
        <input 
          type="range" 
          value={length}
          min={6}
          max={50}
          onChange={(event) => setLength(event.target.value)}
        />
        <label htmlFor="input Range">Password Length: {length}</label>

        <input 
          type="checkbox"
          defaultChecked={numCheck}
          className='cursor-pointer'
          onClick={() => setNumCheck((prev) => !prev)}
        />
        <label htmlFor="Number Allowed">Numbers</label>

        <input 
          type="checkbox" 
          defaultChecked={specialCharCheck}
          className='cursor-pointer'
          onClick={() => setspecialCharCheck((prev) => !prev)}  
        />
        <label htmlFor="Special Character Allowed">Special Character</label>
      </div>
    </div>
    </>
  )
}

export default App