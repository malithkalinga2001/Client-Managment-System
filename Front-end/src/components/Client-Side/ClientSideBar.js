import React, { useState } from 'react'; 
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink for navigation
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../../css/CssClientSide/ClientSidebar.css'

// Import images from assets
import logo from '../../assets/logo.png';
import profileImage from '../../assets/profile-image.png';

const ClientSideBar = () => {
    const navigate = useNavigate();
    const [showPaymentButtons, setShowPaymentButtons] = useState(false); // State to manage double buttons visibility
    const handleLogout = () => {
        navigate('/'); // Navigate to login page
    };
    const handlePaymentClick = () => {
      setShowPaymentButtons(!showPaymentButtons); // Show the buttons when payment is clicked
  };

  return (
    <div className="client-sidebar">
      <div className="client-logo-section">
        <img src={logo} alt="Logo" className="client-logo" />
      </div>
      <div className="client-profile-section">
        <img src={profileImage} alt="Profile" className="client-profile-image" />
        <div className="client-icon-section">
          <NavLink to="/client-profile-update" className="bi bi-person-circle client-icon" style={{ marginRight: '14px' }}></NavLink> {/* Profile Icon */}
          <NavLink to="/ClientChangePass" className="bi bi-gear client-icon" style={{ marginRight: '10px' }}></NavLink> {/* Settings Icon */}
          <NavLink to="/" className="bi bi-power client-icon"></NavLink>{/* Logout Icon */}
        </div>
      </div>
      <ul className="client-sidebar-list">
        <li>
          <NavLink to="/client-dashboard" activeClassName="active-link">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/client-task" activeClassName="active-link">Tasks</NavLink>
        </li>
        <li>
          <NavLink to="/clientInvoice" activeClassName="active-link">Invoices</NavLink>
        </li>
        <li>
          <NavLink to="#" activeClassName="active-link" onClick={handlePaymentClick}>Payment</NavLink>
        </li>
        <li>
          <NavLink to="/client-contact" activeClassName="active-link">Contact</NavLink>
        </li>
      </ul>
      {/* Conditionally Render Double Buttons */}
      {showPaymentButtons && (
                <div className="payment-buttons">
                    <button className="btn btn-secondary" ><NavLink to="/client-payment">Make Payment</NavLink></button>
                    <button className="btn btn-secondary"><NavLink to="/client-bill/:id">My Payments</NavLink></button>
                </div>
            )}
    </div>
  );
};

export default ClientSideBar;
