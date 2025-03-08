import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../../assets/assets'
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/Authentication/Actions';

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeMenu, setActiveMenu] = useState("");
  const [menu, setMenu] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const { getTotalCartAmount } = useContext(StoreContext);

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (location.hash === "#explore-menu") {
      const section = document.getElementById("explore-menu");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setActiveMenu(location.pathname); // Default to pathname
    }
  }, [location]);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt='' className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={activeMenu === '/' ? "active" : ""}>home</Link>
        <a href='/menu' onClick={() => setMenu("menu")} className={activeMenu === '/menu' ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={activeMenu === '/about' ? "active" : ""}>contact-us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}>
          </div>

        </div>
        {/* If user is logged in, show dropdown */}
        {user ? (
          <div className="navbar-user">
            <button onClick={() => setShowDropdown(!showDropdown)}>Hi, {user}</button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile">Information</Link>
                <Link to="/change-password">Change Password</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>

    </div>
  )
}

export default Navbar
