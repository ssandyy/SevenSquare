import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Footer, Header, Hero, Home, ProductDetails } from './components'
import Sidebar from './components/Sidebar'
import { useContext } from 'react'
import { ProductContext } from './contexts/ProductContext'
import CartDetails from './pages/CartDetails'

function App() {
  const {products} = useContext(ProductContext);
  return (
    <>
      <Router >
        <Header />
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
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
