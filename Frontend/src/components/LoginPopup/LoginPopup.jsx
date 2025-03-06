import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../../assets/assets'
import { useDispatch } from 'react-redux';
import { login } from '../../redux/Authentication/Actions';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currState === "Login") {
      const response = await dispatch(login({ userName, password })); // ✅ Now returns actual API status

      if (response.status === "succes") {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate('/');
          setShowLogin(false); // Close the login popup
        }, 1000);
      } else if (response.status === "fail") {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error(response.message || "An error occurred. Please try again.");
      }
    } else {
      // Handle signup API call (if needed)
      console.log("Signup logic here");
    }
  };


  return (
    <div className='login-popup'>
      <ToastContainer position="top-right" autoClose={3000} />
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input type="text" placeholder="Your email" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
