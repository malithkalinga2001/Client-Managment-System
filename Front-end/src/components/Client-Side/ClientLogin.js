import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import '../../css/CssClientSide/ClientCommon.css';

function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password) {
      toast.error("Please fill in all the fields."); // Show error toast
      return;
    }

    // Make API call to login
    fetch('http://localhost:8081/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('registerId', data.user.registerId); // get the userId and save it to localstorage
        console.log('registerId : ', data.user.registerId );
        
        // Show success toast message
        toast.success("Login successful!");

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/client-dashboard');
        }, 2000); // Delay to allow the toast to be shown
      } else {
        toast.error(data.message); // Show error toast
      }
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error('Login failed. Please try again.'); // Show error toast
    });
  };

  return (
    <div className="client-login">
        <h2>
          CMS
        </h2>
      <h4 className="client-center-texts">Clients Sign in</h4>
      
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
      <div className="client-center-links">
        <Link className="client-forgot-password" to="/client-forgot-password">Forgot Password </Link>
          <Link> | </Link>
        <Link className="client-create-account" to="/client-signup">Create New Account</Link>
      </div>

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
}

export default ClientLogin;
