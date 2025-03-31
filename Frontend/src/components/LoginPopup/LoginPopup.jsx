import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../../assets/assets'
import { useDispatch } from 'react-redux';
import { login, register } from '../../redux/Authentication/Actions';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setUserName("");
    setPassword("");
    setName("");
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currState === "Login") {
        await dispatch(login({ userName, password }, navigate, setShowLogin));
      } else {
        // Registration - handle form submission
        if (!userName || !email || !password) {
          toast.error("All fields are required");
          setIsSubmitting(false);
          return;
        }
        
        await dispatch(register({ userName, email, password }, navigate, setCurrState));
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (mode) => {
    setCurrState(mode);
    resetForm();
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
            <>
              <input 
                type="text" 
                placeholder="Username" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </>
          )}
          {currState === "Login" && (
            <input 
              type="text" 
              placeholder="Username" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
          )}
          <input 
            type="password" 
            placeholder={currState === "Sign Up" ? "Password" : "Password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>Don't have an account? <span onClick={() => switchMode("Sign Up")}>Sign up here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => switchMode("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  )
}

export default LoginPopup
