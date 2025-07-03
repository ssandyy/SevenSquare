import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartContextProvider } from './contexts/CartContext/CartContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
 <CartContextProvider>
    <App /> 
 </CartContextProvider>
)
