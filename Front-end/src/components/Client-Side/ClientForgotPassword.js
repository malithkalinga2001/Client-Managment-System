import React, { useState } from "react"; 
import '../../css/CssClientSide/ClientCommon.css';
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

function ClientForgotPassword() {
  const [email, setEmail] = useState("");
  const [cell_phone_number, setCellPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate(); // for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match"); // Show error toast
      return;
    }

    // Prepare the request body as a JSON object
    const data = {
      email,
      cell_phone_number,
      newPassword
    };

    // API request to validate the credentials and reset the password
    axios.post('http://localhost:8081/reset_password', data)
      .then((res) => {
        toast.success("Password Successfully Updated."); // Show success toast
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/client-login'); // Navigate to login page
        }, 3000);
      })
      .catch((err) => {
        toast.error("Something went wrong, check your credentials Email & Phone and please try again."); // Show error toast
      });
  };

  return (
    <div className="client-change-password">
        <h2>
          CMS
        </h2>
      <h4 className="client-center-texts">Client Forgot Password</h4>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text" 
          placeholder="Enter your Phone No"
          value={cell_phone_number}
          onChange={(e) => setCellPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>

      {/* Toast notification container */}
      <ToastContainer />

      <div className="client-center-links">
        <a className="client-forgot-password" href="/client-signup">Register</a>
        <Link> | </Link>
        <a className="client-back-to-home" href="/client-login">Back to Login</a>
      </div>
    </div>
  );
}

export default ClientForgotPassword;
