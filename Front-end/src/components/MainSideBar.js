import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../css/MainSideBar.css'; // Import the Sidebar CSS
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation

// Import images from assets
import logo from '../assets/logo.png';


const Sidebar = () => {
  return (
    <div className="mainsidebar">
      <div className="main-logo-section">
        <img src={logo} alt="Logo" className="logo-main" />
      
      </div>
      <button type="submit" className="home-button"><NavLink to="/">Home</NavLink></button><br/>
      <button type="submit" className="admin-button"><NavLink to="/admin-login">Admin </NavLink></button><br/>
      <button type="submit" className="client-button"><NavLink to="/client-login">Client </NavLink></button>
      
    </div>
  );
};

export default Sidebar;
