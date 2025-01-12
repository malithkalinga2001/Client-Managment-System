import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles
import Sidebar from './ClientSideBar';
import '../../css/CssClientSide/Contact.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ClientChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'currentPassword') {
      setCurrentPassword(value);
    } else if (id === 'newPassword') {
      setNewPassword(value);
    } else if (id === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset message

    // Check if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required!'); // Show toast for missing fields
      return;
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      toast.error('Invalid password format!'); // Show toast for invalid password format
      return;
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!'); // Show toast for password mismatch
      return;
    }

    try {
      const registerId = localStorage.getItem("registerId");
      const response = await fetch('http://localhost:8081/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currentPassword, // Backend expects 'currentPassword'
          newPassword: newPassword, 
          registerId:registerId        // Backend expects 'newPassword'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "An unknown error occurred."); // Handle eror
      } else {
        toast.success("Password changed successfully!"); // Show success message
        // Reset form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while changing the password.'); // Handle fetch error
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', height: '100vh' }}>
      <style>
        {`
          /* CSS for white box styling */
          .change-password-box {
            background-color: white;
            padding: 10px; /* Reduced padding */
            font-size: 16px; /* Adjust the font size */
            border-radius: 8px;
            border: 1px solid #ced4da; /* Border style */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%; /* Adjust width to match the layout */
            height: 350px; /* Adjust the height to make the text boxes taller */
            margin: 30px auto; /* Reduced margin */
          }

          /* Styling individual input boxes */
          .password-box {
            margin-bottom: 10px; /* Reduced space between input boxes */
          width: 100%; /* Adjust width to take full space or set a fixed width like 300px */
            height: 80px; /* Adjust height to make the text boxes taller */
            font-size: 16px; /* Adjust font size */
            padding: 10px; /* Adjust padding to control internal space */
            }
          
          .form-label {
            margin-bottom: 3px; /* Reduced space between labels and input fields */
          }


          .form-group {
  flex-grow: 1; 
  margin-bottom: 15px; /* Adjust space between fields */
}

/* Apply only to text input fields */
.form-control {
  width: 100%; /* Full width of the parent container */
  height: 50px; /* Increased height for a bigger text box */
  font-size: 15px; /* Font size for input text */
  padding: 10px; /* Increased padding for a spacious feel */
  border: 1px solid #ced4da; /* Border style */
  border-radius: 4px; /* Rounded corners */
}

          
          /* Placeholder styles (watermarks) for all input fields */
          .form-control::placeholder {
            font-size: 16px; /* Set the same font size for all placeholders */
            font-family: 'Helvetica', sans-serif; /* Set the same font type for all placeholders */
            font-style: normal; /* Set the font-style to normal, ensuring no italics */
            color: #999; /* Placeholder color */
          }

          .text-message {
            color: red;
            font-weight: bold;
            margin-top: 5px; /* Reduced space above the error message */
          }

          .btn-primary {
            width: 130px; /* Adjust the width of the button */
            height: 45px; /* Adjust the height */
            font-size: 14px; /* Change font size */
            padding: 8px; /* Reduced padding */
            background-color: #007bff; /* Button color */
            border: none; /* Remove border */
            border-radius: 5px; /* Rounded corners */
            margin-top: 20px; /* Reduced space above the button */
            margin-left: 10px; /* Move the button 20px to the right */
          }
        `}
      </style>

      <div className="client-header-section">
        <h3>Client Management System</h3>
        <br />
      </div>
      <Sidebar />

      <div className="client-contact-content">
        <p className="profile-breadcrumb">Home / Change Password</p>
        <h2 className="profile-title">Change Password</h2>

        {/* Box with white background around the form, aligned to the center */}
        <div className="change-password-box"> {/* White box for the form */}
          <form onSubmit={handleChangePassword}>
            <div className="col-12 password-box">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                value={currentPassword}
                onChange={handleInputChange}
                placeholder="Current Password" // Updated watermark font for current password, no italics
                required
              />
            </div>

            <div className="col-12 password-box">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={handleInputChange}
                placeholder="New Password" // Watermark for new password
                required
              />
            </div>

            <div className="col-12 password-box">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password" // Watermark for confirm password
                required
              />
            </div>

            {message && <p className="text-message">{message}</p>} {/* Display error messages */}

            {/* Save button with reduced space above it */}
            <div className="col-xs-12">
              <button type="submit" className="btn btn-primary mt-1">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable /> {/* ToastContainer configuration */}
    </div>
  );
}
