import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext.jsx'
import { Provider } from 'react-redux'
import { store } from "../src/redux/Store.js";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </StoreContextProvider>
  </BrowserRouter>
)
