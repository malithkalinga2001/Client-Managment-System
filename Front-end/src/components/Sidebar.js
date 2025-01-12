import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../css/Sidebar.css'; // Import the Sidebar CSS
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink for navigation
// Import images from assets
import logo from '../assets/logo.png';

const Sidebar = () => {
  return (
    
    <div className="sidebar">
      <div className="jd-profile-section">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>
        <div className="jd-icon-section">
        <NavLink to="/admin-profile" className="bi bi-person-circle icon"></NavLink>{/* Profile Icon */} 
        <NavLink to="/admin-change-password" className="bi bi-gear icon"></NavLink> {/* Settings Icon */} 
        <NavLink to="/" className="bi bi-power icon"></NavLink> {/* Logout Icon */} 
        </div>
      </div>
      <ul className="sidebar-list">
       <li> <NavLink to="/dashboard" activeClassName="active-link">Dashboard</NavLink></li>
        <li><NavLink to="/admin-task" activeClassName="active-link">Tasks</NavLink></li>
        <li><NavLink to="/admin-client" activeClassName="active-link">Client</NavLink></li>
        <li><NavLink to="/admin-contact" activeClassName="active-link">Contact</NavLink></li>
        <li><NavLink to="/AdminPayment" activeClassName="active-link">Payment</NavLink></li>
        <li><NavLink to="/add-invoice" activeClassName="active-link">Service Invoice</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;

