import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Named export

import "../css/AdminProfile.css";

const AdminProfile = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const email = decodedToken?.email || ""; // Decode email from token

  // State to manage profile data
  const [profileData, setProfileData] = useState({
    admin_name: "",
    user_name: "",
    email: "",
    contact_number: "",
    registration_date: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    if (!email) {
      toast.error("Invalid or missing token. Please log in again.");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/admin_register/${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging fetched data
        setProfileData(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data. Please try again later.");
      }
    };

    fetchProfileData();
  }, [email]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8081/admin_register/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Error updating profile");
      }

      console.log("Profile updated:", data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-section">
        <h1>Client Management System</h1>
      </div>
      <div className="admin-main-section">
        <p className="profile-breadcrumb">Home / Admin Profile</p>
        <h2 className="profile-title">Admin Profile</h2>
        <Sidebar />
        <form className="form" onSubmit={handleSubmit}>
          <label>Admin Name</label>
          <input
            type="text"
            className="profile-input-box"
            name="admin_name"
            value={profileData.admin_name || ""} // Bind to state
            onChange={handleInputChange}
          />

          <label>Username</label>
          <input
            type="text"
            className="profile-input-box"
            name="user_name"
            value={profileData.user_name || ""} // Bind to state
            onChange={handleInputChange}
          />

          <label>Contact Number</label>
          <input
            type="text"
            className="profile-input-box"
            name="contact_number"
            value={profileData.contact_number || ""} // Bind to state
            onChange={handleInputChange}
          />

          <label>Gmail Address</label>
          <input
            type="text"
            className="profile-input-box"
            name="email"
            value={profileData.email || ""} // Bind to state
            readOnly // Email should not be editable
          />

          <label>Admin Registration Date</label>
          <input
            type="text"
            className="profile-input-box"
            name="registration_date"
            value={profileData.registration_date || ""} // Bind to state
            onChange={handleInputChange}
          />

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminProfile;
