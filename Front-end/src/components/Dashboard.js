import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Adjust the path based on your folder structure
import '../css/Dashboard.css'; // Import your CSS file for the change password page
import admin from '../assets/admin.png';


import axios from 'axios';

const Dashboard = () => {

  const [clients , setClients] =useState([]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(()=>{
     const fetchclients = async () => {

    try {
      const responce = await axios.get("http://localhost:8081/clients");
      setClients(responce.data);
    } catch (error) {
      console.log('fetting error client data',error);
    }
  };
  fetchclients();
  },[]);

   // Update time every second
   useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

// Format date and time
  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();


  return (
    <div className="admin-page-container">
    <div className="admin-header-section">
      <h1>Client Management System</h1>
    </div>
    <div className="admin-main-section" style={{ backgroundImage: `url(${admin})`,backgroundRepeat: 'no-repeat',backgroundPosition: 'center',backgroundPositionY:"200px"}}>
          <p className="profile-breadcrumb"> Home / Dashboard</p>
          <h2 className="profile-title">Dashboard </h2>
          <Sidebar/>
        
        {/* Dashboard Row */}
        <div className="dashboard-row"> 
          {/* Client Card Section */}
          <div className="client-card-container"> 
            <div className="client-card"> 
              <div className="card-left"> 
                <p>Total</p> 
                <h3>Clients</h3> 
              </div> 
              <div className="card-right"> 
                <h2>{clients.length}</h2> 
              </div> 
            </div>
            
            <table className="service-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Company Name</th>
                  <th>Account Type</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.contact_name}</td>
                    <td>{client.address}</td>
                    <td>{client.account_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Time and Date Section */}
        
          <div className="time-date-section" style={{paddingRight:'60px'}}>
            <div className="time-date-box">
              <h3>{formattedDate}</h3>
              <h3>{formattedTime}</h3>

            </div>
            <div className="vision-mission">
        <div className="tag vision-tag">Vision</div>
        <div className="content">
          <h3>OUR VISION</h3>
          <h6 style={{ textAlign: 'center' }}>
            "To be a global leader in innovative software solutions, empowering businesses and individuals to achieve more through technology."
          </h6>
        </div>
      </div>
      <div className="vision-mission">
        <div className="tag mission-tag">Mission</div>
        <div className="content" style={{textAlign:'center'}}>
          <h3>OUR MISSION</h3>
          <h6 style={{ textAlign: 'center' }}>
          "To develop innovative, user-friendly software that solves real-world problems, enhances efficiency, and drives growth, with a focus on customer satisfaction and continuous improvement."
          </h6>
        </div>
      </div>

          </div>
          
        </div>
        
        </div>
       
      <div> 

     

      </div>

     
       

    </div>
   
  );
};

export default Dashboard;
