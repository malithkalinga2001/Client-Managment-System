import React from 'react';
import Sidebar from './MainSideBar'; // Adjust the path based on your folder structure
import '../css/MainDashboard.css'; // Import your CSS file for the change password page

const MainDashboard = () => {
  return (
    <div className="page-container">
      { <Sidebar /> }
      <div className="maincontent">
          
          <h1> Client Management System & Payment System</h1>
        </div>
      
    </div>
  );
};

export default MainDashboard;
