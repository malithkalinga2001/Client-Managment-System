import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../css/AdminSidebar.css'; // Import the Sidebar CSS

// Import images from assets
import logo from '../assets/logo.png';


const Sidebar = () => {
  return (
    <div className="Admin-sidebar">
      <div className="p-profile-section">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>
        <div className="icon-section">
        <a href="/AdminProfile"><i className="bi bi-person-circle icon"></i>{/* Profile Icon */}</a> 
        <a href="/AdminChangePassword"><i className="bi bi-gear icon"></i> {/* Settings Icon */}</a> 
        <a href="/MainDashboard"><i className="bi bi-power icon"></i> {/* Logout Icon */}</a> 
        </div>
      </div>
      <ul className="sidebar-list">
        <a href="/dashboard"><li>Dashboard</li></a>
        <li>Tasks</li>
        <li>Client</li>
        <li>Contact</li>
        <li>Payment</li>
        <li>Service Invoice</li>
      </ul>
    </div>
  );
};

export default Sidebar;
