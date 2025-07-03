
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Cart, Home } from './components';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
// import { useCartContext } from './contexts/CartContext/CartContext';

function App() {

  // const value = useCartContext();
  // console.log(value);
  

  return (
    <>
    <Header />
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter >
      <Footer />

    </>
  )
}

export default App
