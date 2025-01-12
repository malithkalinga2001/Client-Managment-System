import React, { useState }from 'react';
import Sidebar from './Sidebar'; // Adjust the path based on your folder structure
import '../css/AdminChangePassword.css'; // Import your CSS file for the change password page
import { toast, ToastContainer } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles


const AdminChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

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
       const response = await fetch('http://localhost:8081/admin/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currentPassword, // Backend expects 'currentPassword'
          newPassword: newPassword, 
        
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
    <div className="change-page-container">
        <div className="change-header-section">
          <h1>Client Management System</h1>
        </div>
        <div className="change-main-section">
          <p className="profile-breadcrumb"> Home / Change Password</p>
          <h2 className="profile-title">Change Password</h2>
          <Sidebar/>
          <form className="form-ad"onSubmit={handleChangePassword}>
            <label>Current Password</label>
            <input type="password" className="admin-input-box"  name="currentPassword"  value={currentPassword} onChange={handleInputChange}/>
            
            <label>New Password</label>
            <input type="password" className="admin-input-box" name="newPassword"  value={newPassword} onChange={handleInputChange}/>
            
            <label>Confirm New Password</label>
            <input type="password" className="admin-input-box"  name="confirmPassword" value={confirmPassword} onChange={handleInputChange}/>
            
            <button type="submit" className="save-button">Save</button>
          </form>
          <ToastContainer/>
        </div>
        
      </div>
    
  );
};

export default AdminChangePassword;
