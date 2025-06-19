import './App.css'
import Card from './components/Card'

function App() {
  return (
    <>
      <div>
        <h2 className='bg-green-300 rounded text-black'> Cards </h2>
        
      </div>
      <div className='flex flex-wrap gap-4 justify-center pt-[5px]'>
          <Card userName="Sandy" />
          <Card userName="Sandeep" btntext="My Profile" />  {/* passing props to handle in card components */} 
          <Card userName="Dilip" />
          <Card userName="Niki" btntext="My Profile" />
          <Card userName="Tulsi" />
          <Card userName="Gauri" btntext="My Profile" />
        </div>

    </>
  )
}

export default App
