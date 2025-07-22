import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Footer, Header, Hero, Home, ProductDetails } from './components'
import Sidebar from './components/Sidebar'

function App() {

  return (
    <>
      <Router >
        <Header />
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/hero' element={<Hero />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/' element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
