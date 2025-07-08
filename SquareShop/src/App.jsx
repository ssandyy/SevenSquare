
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Cart, Home } from './components';
import AuthLayout from "./components/AuthLayout";
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import EditProfile from './pages/Profile crud/EditProfile';
import Login from './pages/Profile crud/Login';
import Signup from './pages/Profile crud/Signup';
import Profile from './pages/Profile/Profile';

// import { useCartContext } from './contexts/CartContext/CartContext';

function App() {
  // const value = useCartContext();
  // console.log(value);

  return (
    <>
      <BrowserRouter >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={
            <AuthLayout authentication>
                    {" "}
                    <h1 className="text-2xl text-center">My Profile</h1>
                    <Profile />
                </AuthLayout>} />
          <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit-profile" element={
          <AuthLayout authentication>
            <EditProfile />
          </AuthLayout> } />
        </Routes>
        <Footer />
      </BrowserRouter >

    </>
  )
}

export default App
