import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Footer, Header, Hero, Home, ProductDetails } from './components'
import Sidebar from './components/Sidebar'
import { useContext } from 'react'
import { ProductContext } from './contexts/ProductContext'
import CartDetails from './pages/CartDetails'
import AdminDashboard from './adminpanel/Dashboard/AdminDashboard'
import AdminLogin from './adminpanel/Dashboard/Auth/AdminLogin'
import AdminSignup from './adminpanel/Dashboard/Auth/AdminSignup'
import ForgotPassword from './adminpanel/Dashboard/Auth/ForgotPassword'

function App() {
  const {products} = useContext(ProductContext);
  return (
    <>
      <Router >
        <Header />
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/signup' element={<AdminSignup />} />
          <Route path='/admin/forgotpassword' element={<ForgotPassword />} />
          <Route path='/hero' element={<Hero />} />
          <Route path='/cart' element={<CartDetails />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/' element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
