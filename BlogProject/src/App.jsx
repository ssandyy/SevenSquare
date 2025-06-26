import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from "./appwrite/auth";
import { Footer, Header } from './components';
import { login, logout } from './Store/authSlice.js';

function App() {
  //console.log(import.meta.env);
  
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(userData))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
        {/* TODO:  <Outlet /> */}
        <h1>hi</h1>
        </main>
        <Footer />
      </div>
    </div>
  ) : null

}

export default App