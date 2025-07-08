import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { CartContextProvider } from './contexts/CartContext/CartContext.jsx'
import './index.css'
import store from './Store/store.js'

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
      <CartContextProvider>
         <App /> 
      </CartContextProvider>
   </Provider>
)
