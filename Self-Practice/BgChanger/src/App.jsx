import { useState } from 'react'
import './App.css'
import Button from './components/Button'

function App() {
const [bgColor, setColorBg] = useState("olive")
 
  return (
      <div className='w-full h-screen duration-200' style={{backgroundColor: bgColor}}>
              <h1 className='font-extrabold text-3xl'>Hello Coder ..!</h1>
              <h3>Click Below buttons to change Background Color </h3>
              <div className='fixed flex flex-wrap justify-center bottom-12 px-2 inset-x-0 '>
                <div className='flex flex-wrap justify-center bg-white gap-3 px-4 rounded-2xl'>
                  <Button color= "olive" btnName="Olive" setColor={setColorBg}/>
                  <Button color= "red" btnName="Red" setColor={setColorBg}/>
                  <Button color="purple" btnName="Purple" setColor={setColorBg}/>
                  <Button color= "green" btnName="Green" setColor={setColorBg}/>
                  <Button color= "Lavender" btnName="Lavender" setColor={setColorBg}/>
                  <Button color="yellow" btnName="Yellow" setColor={setColorBg}/>
                </div>
              </div>
      </div>
  )
}

export default App
