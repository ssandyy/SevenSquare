import './App.css'
import Login from './components/Login'
import Profiles from './components/Profiles'
import UserContextProvider from './context/UserContextProvider'

function App() {

  return (
    <UserContextProvider>
      <h2>Hi..!</h2>
      <Login />
      <Profiles />
    </UserContextProvider>
  )
}

export default App
