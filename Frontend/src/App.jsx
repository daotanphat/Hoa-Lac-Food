import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import PlaceHolder from './pages/PlaceHolder/PlaceHolder'
import Footer from './components/Footer/Footer'
import AppDownload from './components/AppDownload/AppDownload'
import LoginPopup from './components/LoginPopup/LoginPopup'
import { ToastContainer } from 'react-toastify'
import OrderPage from './pages/Order/Order'
import ShopsPage from './pages/Shops/ShopsPage'
import ShopDetailPage from './pages/ShopDetail/ShopDetailPage'
const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<PlaceHolder />} />
          <Route path='/order' element={<OrderPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/shops/:shopId" element={<ShopDetailPage />} />
        </Routes>
        <AppDownload />

      </div>
      <Footer />
    </>
  )
}

export default App
