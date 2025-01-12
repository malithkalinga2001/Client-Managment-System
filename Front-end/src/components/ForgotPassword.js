import React, { useState } from "react";
import "../css/Common.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [contact_number, setCellPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const navigate = useNavigate(); // for navigation

  const handleSubmit =async(e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          contact_number,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successful!");
         // Navigate to dashboard after a short delay
         setTimeout(() => {
          navigate('/admin-login');
        }, 2000); // Delay to allow the toast to be shown
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error submitting the request.");
    }
  };

  return (
  
      <div className="forgot-password">
        <h2>
          CMS
        </h2>
      <h4 className="center-texts">Forgot Password</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="cellPhoneNumber"
          placeholder="Enter your Phone No"
          value={contact_number}
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
        <div className="center-links">
        <a className="MainDashboard" href="/">Back To Home</a>
        </div>
        <ToastContainer />
      </div>
    
  );
}

export default ForgotPassword;
