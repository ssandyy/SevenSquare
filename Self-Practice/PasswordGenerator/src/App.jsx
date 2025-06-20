import { useCallback, useState } from 'react'
import './App.css'

function App() {
  const[length, setLength] = useState(8)
  const[numCheck, setNumCheck] = useState(false)
  const[specialCharCheck, setspecialCharCheck] = useState(true)
  const[password, setPassword] = useState("")

  // const passwordGenerator = useCallback(() => {}, [length, specialCharCheck, numCheck, setPassword]) 
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"


    if(numCheck){  // if numbers is allowed then concat with string
      return str+= "0123456789"
    }
    if (specialCharCheck) str += "!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"

    for (let i = 0; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass= str.charAt(char)
    }
    setPassword(pass)

  }, [length, specialCharCheck, numCheck, setPassword]) 


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


        <button onClick={passwordGenerator}></button>
      </div>
    </div>
    </>
  )
}

export default App