import React, { useState } from "react";
import "../css/Common.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // For making HTTP requests
import "react-toastify/dist/ReactToastify.css";
import {  toast,ToastContainer } from 'react-toastify';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate(); // for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:8081/admin/login', {
        email,
        password
      });

      // If login is successful, store the token and redirect to the dashboard
      const { token } = response.data;
      localStorage.setItem('token', token);  // Save token in local storage
      toast.success("Login successful!");
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/Dashboard');
      }, 2000); // Delay to allow the toast to be shown
    } catch (error) {
      // If there's an error (e.g., wrong password), show an alert
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);// Show error message from the server
      } else {
        toast.error('Login failed. Please try again.'); 
      }
    }
  };

  return (
   
      <div className="login">
        <h2>
          CMS
        </h2>
        <h4 className="center-texts"> Sign in</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="center-links">
  
          <Link className="admin-forgot-password" to="/forgot-password">Forgot Password </Link>
          <Link> | </Link>
        <Link className="admin-create-account" to="/">Back To Home</Link>
        </div>
        <ToastContainer /> {/* Ensure ToastContainer is rendered */}
      </div>
    
  );
}

export default Login;
